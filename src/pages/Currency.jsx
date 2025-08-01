import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { CurrencyContext } from "../contexts/CurrencyContext";

const Currency = () => {
  const [currencies, setCurrencies] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const { updateCurrency } = useContext(CurrencyContext);

  const currencyApi = import.meta.env.VITE_CURRENCY_URL;
  const userApi = import.meta.env.VITE_USER_URL;

  const loggedUser = JSON.parse(localStorage.getItem("currentUser"));
  const loggedId = loggedUser?.id;

  useEffect(() => {
    if (!loggedId) {
      setError("User not logged in");
      return;
    }

    const fetchData = async () => {
      try {
        const [currencyRes, userRes] = await Promise.all([
          axios.get(currencyApi),
          axios.get(`${userApi}/${loggedId}`),
        ]);

        setCurrencies(currencyRes.data);
        setUser(userRes.data);
        setSelectedCurrency(userRes.data.preferredCurrency || "");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Could not load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedId, currencyApi, userApi]);

  const handleSave = async () => {
    if (!selectedCurrency || !loggedId) return;
    setSaving(true);

    try {
      const updatedUser = {
        ...user,
        preferredCurrency: selectedCurrency,
      };

      const { password, ...safeUser } = updatedUser;

      await axios.patch(`${userApi}/${loggedId}`, {
        preferredCurrency: selectedCurrency,
      });

      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
      updateCurrency(selectedCurrency);
      alert("Currency save within user's data") ;
    } catch (err) {
      console.error("Failed to update currency", err);
      setError("Could not update currency");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading Currencies...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not loaded</p>;

  return (
    <div className="container-fluid mt-4">
      <h4 className="mb-3">Preferred Currency</h4>
      <div className="row align-items-center">
        <div className="col-12 col-md-10">
          <select
            className="form-select"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <option value="">-- Select currency --</option>
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-2 text-md-end mt-2 mt-md-0">
          <button
            className="btn btn-primary w-100 w-md-auto"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {selectedCurrency && (
        <div className="mt-3">
          <strong>Selected Currency:</strong> {selectedCurrency} - {currencies[selectedCurrency]}
        </div>
      )}
    </div>
  );
};

export default Currency;

