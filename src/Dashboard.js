import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { loginId } = useParams();
  const [restoDetails, setRestoDetails] = useState({
    name: '',
    location: '',
    chargeCustomers: true,
    customAmount: 0,
    regularAmounts: [0, 0, 0, 0],
  });
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        console.log(loginId)
        const response = await axios.get(`https://stg.dhunjam.in/account/admin/${loginId}`);

        setRestoDetails({
          name: response.data.data.name,
          location: response.data.data.location,
          chargeCustomers: response.data.data.charge_customers,
          customAmount: response.data.data.amount.category_6,
          regularAmounts: [
            response.data.data.amount.category_7,
            response.data.data.amount.category_8,
            response.data.data.amount.category_9,
            response.data.data.amount.category_10,
          ],
        });
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    fetchRestaurantDetails();
  }, [loginId]);
  const areInputsValid = () => {
    const isCustomAmountValid = parseInt(restoDetails.customAmount) >= 99;
    const areRegularAmountsValid = restoDetails.regularAmounts.every(
      (amount, index) => parseInt(amount) >= (79 - index * 20)
    );
    return isCustomAmountValid && areRegularAmountsValid;
  };

  useEffect(() => {
    setIsSaveButtonDisabled(!areInputsValid());
  }, [restoDetails.customAmount, restoDetails.regularAmounts]);
  const updateCustomAmount = (value) => {
    setRestoDetails({ ...restoDetails, customAmount: value });
  };

  const updateRegularAmount = (index, value) => {
    const updatedRegularAmounts = [...restoDetails.regularAmounts];
    updatedRegularAmounts[index] = value;
    console.log(updatedRegularAmounts)
    setRestoDetails({ ...restoDetails, regularAmounts: updatedRegularAmounts });
  };

  const chartData = [
    { name: 'Custom', amount: restoDetails.customAmount },
    { name: 'Category 1', amount: restoDetails.regularAmounts[0] },
    { name: 'Category 2', amount: restoDetails.regularAmounts[1] },
    { name: 'Category 3', amount: restoDetails.regularAmounts[2] },
    { name: 'Category 4', amount: restoDetails.regularAmounts[3] },
  ];

  

    const handleSaveClick= async () => {
      try {
        const updatedAmount = {
          category_6: parseInt(restoDetails.customAmount),
          category_7: parseInt(restoDetails.regularAmounts[0]),
          category_8: parseInt(restoDetails.regularAmounts[1]),
          category_9: parseInt(restoDetails.regularAmounts[2]),
          category_10: parseInt(restoDetails.regularAmounts[3]),
        };
        await axios.put(`https://stg.dhunjam.in/account/admin/${loginId}`, {
          amount: updatedAmount,
        });
        const response = await axios.get(`https://stg.dhunjam.in/account/admin/${loginId}`);
        const updatedDetails = response.data.data;
    
        setRestoDetails({
          name: updatedDetails.name,
          location: updatedDetails.location,
          chargeCustomers: updatedDetails.charge_customers,
          customAmount: updatedDetails.amount.category_6,
          regularAmounts: [
            updatedDetails.amount.category_7,
            updatedDetails.amount.category_8,
            updatedDetails.amount.category_9,
            updatedDetails.amount.category_10,
          ],
        });
    
        console.log('Prices updated and details fetched successfully:', updatedDetails);
      } catch (error) {
        console.error('Error while saving prices:', error);
      }
    }


  return (
    <div className="container">
       <h1>{restoDetails.name}, {restoDetails.location} on dhunjam</h1>

      <div className="header">
        <div className="radioContainer">
          <h4 className="form-label">Do You Want To Charge Your Customers for Requesting Songs?:</h4>
        </div>
        <div className="radioOptions">
          <div>
            <input
              type="radio"
              id="chargeYes"
              checked={restoDetails.chargeCustomers}
              onChange={() => setRestoDetails({ ...restoDetails, chargeCustomers: true })}
            />
            <label htmlFor="chargeYes" className="yes">Yes</label>
          </div>
          <div>
            <input
              type="radio"
              id="chargeNo"
              checked={!restoDetails.chargeCustomers}
              onChange={() => setRestoDetails({ ...restoDetails, chargeCustomers: false })}
            />
            <label htmlFor="chargeNo" className="no">No</label>
          </div>
        </div>
      </div>

      <div className="amountSection">
        <div className="amountLabel">
          <h4>Custom Song Request Amount:</h4>
        </div>
        <div className="amountInputContainer">
          <input
            type="string"
            value={restoDetails.customAmount}
            onChange={(e) => updateCustomAmount(e.target.value)}
            min="99"
            disabled={!restoDetails.chargeCustomers}
            className={`customAmountInput ${!restoDetails.chargeCustomers ? 'disabled' : ''}`}
            style={{ backgroundColor: restoDetails.chargeCustomers ? 'black' : '#C2C2C2' }}
          />
        </div>
      </div>
      <div className="amountSection">
  <div className="regularAmountsLabel">
    <h4>Regular Song Request Amounts From High To Low:</h4>
  </div>
  <div className={`regularAmountsContainer ${!restoDetails.chargeCustomers ? 'disabled' : ''}`}>
    {/* Input for 79 */}
    <input
      type="string"
      value={restoDetails.regularAmounts[0]}
      onChange={(e) => updateRegularAmount(0, e.target.value)}
      min="79"
      disabled={!restoDetails.chargeCustomers}
      className={`customAmountInput ${!restoDetails.chargeCustomers ? 'disabled' : ''}`}
      style={{ backgroundColor: restoDetails.chargeCustomers ? 'black' : '#C2C2C2' }}
    />
    {/* Input for 59 */}
    <input
      type="string"
      value={restoDetails.regularAmounts[1]}
      onChange={(e) => updateRegularAmount(1, e.target.value)}
      min="59"
      disabled={!restoDetails.chargeCustomers}
      className={`customAmountInput ${!restoDetails.chargeCustomers ? 'disabled' : ''}`}
      style={{ backgroundColor: restoDetails.chargeCustomers ? 'black' : '#C2C2C2' }}
    />
    {/* Input for 39 */}
    <input
      type="string"
      value={restoDetails.regularAmounts[2]}
      onChange={(e) => updateRegularAmount(2, e.target.value)}
      min="39"
      disabled={!restoDetails.chargeCustomers}
      className={`customAmountInput ${!restoDetails.chargeCustomers ? 'disabled' : ''}`}
      style={{ backgroundColor: restoDetails.chargeCustomers ? 'black' : '#C2C2C2' }}
    />
    {/* Input for 19 */}
    <input
      type="string"
      value={restoDetails.regularAmounts[3]}
      onChange={(e) => updateRegularAmount(3, e.target.value)}
      min="19"
      disabled={!restoDetails.chargeCustomers}
      className={`customAmountInput ${!restoDetails.chargeCustomers ? 'disabled' : ''}`}
      style={{ backgroundColor: restoDetails.chargeCustomers ? 'black' : '#C2C2C2' }}
    />
  </div>
</div>

      <div className={`graphPlaceholder ${!restoDetails.chargeCustomers ? 'disabled' : ''}`}>
        {restoDetails.chargeCustomers ? (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="amount" fill="#F0C3F1" barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ width: 0, height: 0 }} />
        )}
      </div>
      
      {restoDetails.chargeCustomers && (
        <button className={`saveButton ${isSaveButtonDisabled ? 'disabled' : ''}`} onClick={handleSaveClick} disabled={isSaveButtonDisabled}>
          Save
        </button>
      )}
    </div>
  );
};

export default Dashboard;