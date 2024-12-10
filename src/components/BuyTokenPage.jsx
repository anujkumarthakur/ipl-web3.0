import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BuyTokenPage = () => {
    const [amount, setAmount] = useState(100);  // Default token amount to buy
    const [connected, setConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState(null);

    // Your Solana address (where the money will go)
    const solanaAddress = 'YOUR_SOLANA_WALLET_ADDRESS';

    // Connect Phantom Wallet
    const connectWallet = async () => {
        try {
            const solana = window.solana;
            if (solana && solana.isPhantom) {
                const response = await solana.connect();
                setWalletAddress(response.publicKey.toString());
                setConnected(true);
                setProvider(solana);
            } else {
                alert("Phantom wallet is not installed.");
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Failed to connect Phantom wallet.");
        }
    };

    // Handle Solana Transaction
    const handleBuyTokens = async () => {
        if (!connected) {
            alert('Please connect your Phantom wallet first.');
            return;
        }

        // Convert the amount to lamports (1 SOL = 1 billion lamports)
        const amountInLamports = amount * 1000000000; // Adjust based on your token rate

        try {
            const transaction = await provider.request({
                method: 'solana.requestAirdrop',
                params: [solanaAddress, amountInLamports], // Send to your Solana address
            });

            console.log('Transaction sent:', transaction);
            alert(`Successfully sent ${amount} SOL to ${solanaAddress}`);
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed');
        }
    };

    useEffect(() => {
        // Automatically connect to wallet if already connected
        if (window.solana && window.solana.isPhantom) {
            window.solana.on('connect', () => {
                setWalletAddress(window.solana.publicKey.toString());
                setConnected(true);
            });
        }
    }, []);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <Link to="/" className="flex items-center text-gray-600">
                    <FiArrowLeft size={24} />
                    <span className="ml-2">Back to Dashboard</span>
                </Link>
            </div>

            <h2 className="text-2xl font-bold mb-4">Buy Tokens</h2>

            {/* Displaying current wallet balance */}
            {/* <div className="mb-6">
                <h3 className="text-lg font-semibold">Current Wallet Balance:</h3>
                <p className="text-2xl font-bold text-green-500">$100 (Fake Balance)</p>
            </div> */}

            {/* Connect Wallet Button */}
            <div className="mb-6">
                {!connected ? (
                    <button
                        onClick={connectWallet}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition"
                    >
                        Connect Phantom Wallet
                    </button>
                ) : (
                    <p className="text-lg font-semibold">Wallet Connected: {walletAddress}</p>
                )}
            </div>

            {/* Token Amount Selection */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold">Select Amount:</h3>
                <select
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value={100}>100 IPLW3.0</option>
                    <option value={200}>200 IPLW3.0</option>
                    <option value={500}>500 IPLW3.0</option>
                    <option value={1000}>1000 IPLW3.0</option>
                </select>
            </div>

            {/* Buy Button */}
            <div>
                <button
                    onClick={handleBuyTokens}
                    className={`w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition ${!connected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!connected}
                >
                    Buy {amount} IPLW3.0
                </button>
            </div>
        </div>
    );
};

export default BuyTokenPage;
