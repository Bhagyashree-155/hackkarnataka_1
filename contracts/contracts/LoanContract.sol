// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LoanContract
 * @dev A decentralized micro-lending smart contract for BlockGenix
 */
contract LoanContract {
    // Loan status enum
    enum LoanStatus {
        Pending,
        Approved,
        Rejected,
        Active,
        Repaid,
        Defaulted
    }

    // Loan structure
    struct Loan {
        uint256 id;
        address borrower;
        address lender;
        uint256 amount;
        uint256 term; // in days
        uint256 interestRate; // in basis points (e.g., 500 = 5%)
        uint256 createdAt;
        uint256 dueDate;
        uint256 repaidAmount;
        LoanStatus status;
    }

    // State variables
    address public owner;
    uint256 public loanCounter;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;
    mapping(uint256 => bool) public loanExists;

    // Events
    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 term,
        uint256 interestRate
    );

    event LoanApproved(
        uint256 indexed loanId,
        address indexed lender,
        address indexed borrower
    );

    event LoanRejected(uint256 indexed loanId, address indexed lender);

    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount
    );

    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier loanExistsCheck(uint256 _loanId) {
        require(loanExists[_loanId], "Loan does not exist");
        _;
    }

    modifier onlyBorrower(uint256 _loanId) {
        require(
            loans[_loanId].borrower == msg.sender,
            "Only borrower can call this function"
        );
        _;
    }

    modifier onlyLender(uint256 _loanId) {
        require(
            loans[_loanId].lender == msg.sender,
            "Only lender can call this function"
        );
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        loanCounter = 0;
    }

    /**
     * @dev Create a new loan request
     * @param _amount Loan amount in wei
     * @param _term Loan term in days
     * @param _interestRate Interest rate in basis points (e.g., 500 = 5%)
     */
    function createLoan(
        uint256 _amount,
        uint256 _term,
        uint256 _interestRate
    ) external returns (uint256) {
        require(_amount > 0, "Loan amount must be greater than 0");
        require(_term > 0, "Loan term must be greater than 0");
        require(
            _interestRate > 0 && _interestRate <= 10000,
            "Interest rate must be between 0 and 10000 basis points"
        );

        loanCounter++;
        uint256 loanId = loanCounter;

        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            term: _term,
            interestRate: _interestRate,
            createdAt: block.timestamp,
            dueDate: 0,
            repaidAmount: 0,
            status: LoanStatus.Pending
        });

        loanExists[loanId] = true;
        borrowerLoans[msg.sender].push(loanId);

        emit LoanCreated(loanId, msg.sender, _amount, _term, _interestRate);

        return loanId;
    }

    /**
     * @dev Approve a loan request and fund it
     * @param _loanId ID of the loan to approve
     */
    function approveLoan(
        uint256 _loanId
    ) external payable loanExistsCheck(_loanId) {
        Loan storage loan = loans[_loanId];
        require(
            loan.status == LoanStatus.Pending,
            "Loan is not pending"
        );
        require(
            msg.value >= loan.amount,
            "Insufficient funds to approve loan"
        );

        loan.lender = msg.sender;
        loan.status = LoanStatus.Active;
        loan.dueDate = block.timestamp + (loan.term * 1 days);
        loan.repaidAmount = 0;

        lenderLoans[msg.sender].push(_loanId);

        // Transfer funds to borrower
        (bool success, ) = loan.borrower.call{value: loan.amount}("");
        require(success, "Transfer to borrower failed");

        // Refund excess if any
        if (msg.value > loan.amount) {
            (bool refundSuccess, ) = msg.sender.call{
                value: msg.value - loan.amount
            }("");
            require(refundSuccess, "Refund failed");
        }

        emit LoanApproved(_loanId, msg.sender, loan.borrower);
    }

    /**
     * @dev Reject a loan request
     * @param _loanId ID of the loan to reject
     */
    function rejectLoan(
        uint256 _loanId
    ) external loanExistsCheck(_loanId) {
        Loan storage loan = loans[_loanId];
        require(
            loan.status == LoanStatus.Pending,
            "Loan is not pending"
        );

        loan.status = LoanStatus.Rejected;

        emit LoanRejected(_loanId, msg.sender);
    }

    /**
     * @dev Repay a loan
     * @param _loanId ID of the loan to repay
     */
    function repayLoan(
        uint256 _loanId
    ) external payable loanExistsCheck(_loanId) onlyBorrower(_loanId) {
        Loan storage loan = loans[_loanId];
        require(
            loan.status == LoanStatus.Active,
            "Loan is not active"
        );

        uint256 totalAmount = loan.amount +
            ((loan.amount * loan.interestRate) / 10000);
        uint256 remainingAmount = totalAmount - loan.repaidAmount;

        require(msg.value >= remainingAmount, "Insufficient repayment amount");

        loan.repaidAmount = totalAmount;
        loan.status = LoanStatus.Repaid;

        // Transfer repayment to lender
        (bool success, ) = loan.lender.call{value: totalAmount}("");
        require(success, "Transfer to lender failed");

        // Refund excess if any
        if (msg.value > remainingAmount) {
            (bool refundSuccess, ) = msg.sender.call{
                value: msg.value - remainingAmount
            }("");
            require(refundSuccess, "Refund failed");
        }

        emit LoanRepaid(_loanId, msg.sender, totalAmount);
    }

    /**
     * @dev Mark a loan as defaulted (can be called by anyone after due date)
     * @param _loanId ID of the loan to mark as defaulted
     */
    function markAsDefaulted(
        uint256 _loanId
    ) external loanExistsCheck(_loanId) {
        Loan storage loan = loans[_loanId];
        require(
            loan.status == LoanStatus.Active,
            "Loan is not active"
        );
        require(
            block.timestamp > loan.dueDate,
            "Loan is not yet due"
        );

        loan.status = LoanStatus.Defaulted;

        emit LoanDefaulted(_loanId, loan.borrower);
    }

    /**
     * @dev Get loan details
     * @param _loanId ID of the loan
     * @return Loan struct
     */
    function getLoan(
        uint256 _loanId
    ) external view loanExistsCheck(_loanId) returns (Loan memory) {
        return loans[_loanId];
    }

    /**
     * @dev Get all loan IDs for a borrower
     * @param _borrower Address of the borrower
     * @return Array of loan IDs
     */
    function getBorrowerLoans(
        address _borrower
    ) external view returns (uint256[] memory) {
        return borrowerLoans[_borrower];
    }

    /**
     * @dev Get all loan IDs for a lender
     * @param _lender Address of the lender
     * @return Array of loan IDs
     */
    function getLenderLoans(
        address _lender
    ) external view returns (uint256[] memory) {
        return lenderLoans[_lender];
    }

    /**
     * @dev Get total number of loans
     * @return Total number of loans
     */
    function getTotalLoans() external view returns (uint256) {
        return loanCounter;
    }

    /**
     * @dev Calculate total repayment amount for a loan
     * @param _loanId ID of the loan
     * @return Total repayment amount including interest
     */
    function calculateRepaymentAmount(
        uint256 _loanId
    ) external view loanExistsCheck(_loanId) returns (uint256) {
        Loan memory loan = loans[_loanId];
        return loan.amount + ((loan.amount * loan.interestRate) / 10000);
    }
}

