import { useDeployedContractInfo } from "./scaffold-eth/useDeployedContractInfo";
import { useTargetNetwork } from "./scaffold-eth/useTargetNetwork";
import { useReadContract } from "wagmi";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function useReadDePhilContractHooks() {
  const { targetNetwork } = useTargetNetwork();
  const contractsData = getAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];
  const { data: deployedContractData } = useDeployedContractInfo(contractNames[1]);

  const useGetPublication = (publicationId: number) => {
    const { data, isLoading, error } = useReadContract({
      address: deployedContractData?.address,
      functionName: "getPublication",
      abi: deployedContractData?.abi,
      args: [publicationId],
      chainId: targetNetwork.id,
      query: {
        retry: true,
      },
    });

    return { data, isLoading, error };
  };

  const useGetProfile = (address: string) => {
    const { data, isLoading, error } = useReadContract({
      address: deployedContractData?.address,
      functionName: "getProfile",
      abi: deployedContractData?.abi,
      args: [address],
      chainId: targetNetwork.id,
      query: {
        retry: true,
      },
    });

    return { data, isLoading, error };
  };

  const useGetComments = (address: string) => {
    const { data, isLoading, error } = useReadContract({
      address: deployedContractData?.address,
      functionName: "getComments",
      abi: deployedContractData?.abi,
      args: [address],
      chainId: targetNetwork.id,
      query: {
        retry: true,
      },
    });

    return { data, isLoading, error };
  };

  const useGetUserPoints = (address: string) => {
    const { data, isLoading, error } = useReadContract({
      address: deployedContractData?.address,
      functionName: "userPoints",
      abi: deployedContractData?.abi,
      args: [address],
      chainId: targetNetwork.id,
      query: {
        retry: true,
      },
    });

    return { data, isLoading, error };
  };

  return {
    useGetPublication,
    useGetProfile,
    useGetComments,
    useGetUserPoints,
  };
}
