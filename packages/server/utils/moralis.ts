import axios from "axios"
import { ApprovalSummary } from "../interfaces/approval";
import { baseSepolia, lineaSepolia, mantaSepoliaTestnet, polygonAmoy, sepolia } from "viem/chains";

export async function getMoralisWalletApprovals(walletAddress: string): Promise<ApprovalSummary[]> {
    try {
        const response = await axios.get(
            `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/approvals`, 
            {
                params: {
                    chain: 'sepolia',
                    limit: 100
                },
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': process.env.MORALIS_API_KEY
                }
            }
        );

        // Process the approvals
        const approvals = response.data.result.map((approval: any) => ({
            owner: walletAddress,
            transactionHash: approval.transaction_hash,
            tokenAddress: approval.token.address,
            spender: approval.spender.address,
            value: approval.value_formatted,
            valueAtRisk: approval.token.usd_at_risk,
            tokenDetails: {
                name: approval.token.name,
                symbol: approval.token.symbol,
                decimals: approval.token.decimals,
                usdPrice: approval.token.usd_price,
                logoUrl: approval.token.logoUrl,
            }
        }));

        return approvals;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data || error.message);
        } else {
            console.error('Error:', error);
        }
        throw error;
    }
}

export const moralisSupportedChains = [sepolia, mantaSepoliaTestnet, lineaSepolia, baseSepolia, polygonAmoy]