const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoanContract", function () {
  let loanContract;
  let owner;
  let borrower;
  let lender;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, borrower, lender, addr1, addr2] = await ethers.getSigners();

    const LoanContract = await ethers.getContractFactory("LoanContract");
    loanContract = await LoanContract.deploy();
    await loanContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await loanContract.owner()).to.equal(owner.address);
    });

    it("Should start with zero loans", async function () {
      expect(await loanContract.getTotalLoans()).to.equal(0);
    });
  });

  describe("Creating Loans", function () {
    it("Should create a loan request", async function () {
      const amount = ethers.parseEther("1.0");
      const term = 30;
      const interestRate = 500; // 5%

      await expect(
        loanContract.connect(borrower).createLoan(amount, term, interestRate)
      )
        .to.emit(loanContract, "LoanCreated")
        .withArgs(1, borrower.address, amount, term, interestRate);

      const loan = await loanContract.getLoan(1);
      expect(loan.borrower).to.equal(borrower.address);
      expect(loan.amount).to.equal(amount);
      expect(loan.term).to.equal(term);
      expect(loan.interestRate).to.equal(interestRate);
      expect(loan.status).to.equal(0); // Pending
    });

    it("Should reject loan with zero amount", async function () {
      await expect(
        loanContract.connect(borrower).createLoan(0, 30, 500)
      ).to.be.revertedWith("Loan amount must be greater than 0");
    });
  });

  describe("Approving Loans", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1.0");
      await loanContract
        .connect(borrower)
        .createLoan(amount, 30, 500);
    });

    it("Should approve and fund a loan", async function () {
      const amount = ethers.parseEther("1.0");
      const borrowerBalanceBefore = await ethers.provider.getBalance(
        borrower.address
      );

      await expect(
        loanContract.connect(lender).approveLoan(1, { value: amount })
      )
        .to.emit(loanContract, "LoanApproved")
        .withArgs(1, lender.address, borrower.address);

      const loan = await loanContract.getLoan(1);
      expect(loan.lender).to.equal(lender.address);
      expect(loan.status).to.equal(3); // Active

      const borrowerBalanceAfter = await ethers.provider.getBalance(
        borrower.address
      );
      expect(borrowerBalanceAfter).to.be.gt(borrowerBalanceBefore);
    });
  });
});

