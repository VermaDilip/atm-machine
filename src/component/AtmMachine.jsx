import React, { useState } from 'react';
import jsPDF from 'jspdf';


const usersData = [
  { userId: 1, name: "John", pin: "1234", balance: 5000 },
  { userId: 2, name: "Alice", pin: "5678", balance: 2000 },
  { userId: 3, name: "Bob", pin: "9012", balance: 10000 },
];

const AtmMachine = () => {
    const [user, setUser] = useState(null);
    const [pin, setPin] = useState('');
    const [operation, setOperation] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [receipt, setReceipt] = useState(false);
    const [atmBalance, setAtmBalance] = useState(100000);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const handlePinSubmit = () => {
      const authenticatedUser = usersData.find(u => u.pin === pin);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setIsAuthenticated(true);
        setMessage(`Welcome, ${authenticatedUser.name}`);
      } else {
        setMessage("Invalid PIN. Try again.");
      }
    };
  
    const handleWithdraw = () => {
      const withdrawalAmount = parseFloat(amount);
      if (user.balance < withdrawalAmount) {
        setMessage("Insufficient balance.");
      } else if (atmBalance < withdrawalAmount) {
        setMessage("ATM capacity exceeded. Server down.");
      } else {
        const newBalance = user.balance - withdrawalAmount;
        const newAtmBalance = atmBalance - withdrawalAmount;
        user.balance = newBalance;
        setAtmBalance(newAtmBalance);
        setMessage(`Success! You withdrew $${withdrawalAmount}. Your new balance is $${newBalance}.`);
        
        if (receipt) {
          generateReceipt(user.name, withdrawalAmount, newBalance);
        }
      }
    };
  
    const handleOperation = (selectedOperation) => {
      setOperation(selectedOperation);
      setMessage('');
    };
  
    const generateReceipt = (name, withdrawn, balance) => {
      const doc = new jsPDF();
    
      // Bank and Branch Info
      const bankName = "ABC Bank Ltd.";
      const branchName = "Downtown Branch";
    
      // Add Title
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text(`${bankName}`, 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Branch: ${branchName}`, 105, 28, { align: "center" });
      
      // Line Separator
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
    
      // Customer and Transaction Info
      doc.setFontSize(12);
      doc.text(`Receipt for ATM Transaction`, 20, 40);
      doc.setFontSize(10);
      doc.text(`Name: ${name}`, 20, 50);
      doc.text(`Amount Withdrawn: $${withdrawn}`, 20, 60);
      doc.text(`Balance Remaining: $${balance}`, 20, 70);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);
    
      // Add Receipt Footer
      doc.setLineWidth(0.5);
      doc.line(20, 90, 190, 90);
    
      doc.setFontSize(10);
      doc.text(`Thank you for banking with us!`, 105, 100, { align: "center" });
      doc.text(`Customer Service: 1800-123-4567`, 105, 108, { align: "center" });
    
      // Save the PDF
      doc.save(`${name}_ATM_Receipt.pdf`);
    };
    
  
    const handleReset = () => {
      setUser(null);
      setIsAuthenticated(false);
      setOperation('');
      setPin('');
      setAmount('');
      setReceipt(false);
      setMessage('');
    };
  
    return (
      <div className="atm-app">
        <div className="atm-machine">
          <h1>ATM Machine</h1>
          {user ? (
            <div className="atm-card">
              {operation === '' ? (
                <>
                  <h2>Select Operation</h2>
                  <button className="atm-button" onClick={() => handleOperation('withdraw')}>Withdraw</button>
                  <button className="atm-button" onClick={() => handleOperation('checkBalance')}>Check Balance</button>
                  <button className="atm-button" onClick={handleReset}>Exit</button>
                </>
              ) : (
                <>
                  {operation === 'checkBalance' && (
                    <div>
                      <h2>Your balance is ${user.balance}</h2>
                      <button className="atm-button" onClick={handleReset}>Return</button>
                    </div>
                  )}
                  {operation === 'withdraw' && (
                    <div>
                      <h2>Withdraw Money</h2>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={receipt}
                            onChange={() => setReceipt(!receipt)}
                          />
                          Do you want a receipt?
                        </label>
                      </div>
                      <button className="atm-button" onClick={handleWithdraw}>Confirm Withdraw</button>
                      <button className="atm-button cancel" onClick={handleReset}>Cancel</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="atm-card">
              <h2>Enter your PIN</h2>
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button className="atm-button" onClick={handlePinSubmit}>Submit PIN</button>
            </div>
          )}
          <p className="message">{message}</p>
        </div>
      </div>
    );
  };

export default AtmMachine
