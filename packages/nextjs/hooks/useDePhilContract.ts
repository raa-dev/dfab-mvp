import { useDeployedContractInfo } from "./scaffold-eth/useDeployedContractInfo";
import { useTargetNetwork } from "./scaffold-eth/useTargetNetwork";
import { Hex } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { IPublication } from "~~/types/dePhil";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function useReadDePhilContractHooks() {
  const { targetNetwork } = useTargetNetwork();
  const contractsData = getAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];
  const { data: deployedContractData } = useDeployedContractInfo(contractNames[1]);

  const useGetPublication = (publicationId: bigint) => {
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

export function useWriteDePhilContractHooks() {
  const { targetNetwork } = useTargetNetwork();
  const contractsData = getAllContracts();
  const contractNames = Object.keys(contractsData) as ContractName[];
  const { data: deployedContractData } = useDeployedContractInfo(contractNames[1]);

  const useAddProfile = (address: Hex) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "addProfile",
      args: [address as unknown as string, ""],
    });
  };

  const useAddComment = (publicationId: bigint | number, comment: string) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "addComment",
      args: [BigInt(publicationId), comment],
    });
  };

  const useFollow = (address: Hex) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "follow",
      args: [address],
    });
  };

  const useUnfollow = (address: Hex) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "unfollow",
      args: [address],
    });
  };

  const useUpVotePublication = (publicationId: bigint | number) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "upvotePublication",
      args: [BigInt(publicationId)],
    });
  };

  const useDownVotePublication = (publicationId: bigint | number) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "downvotePublication",
      args: [BigInt(publicationId)],
    });
  };

  const useCreatePublication = ({ uri, title, summary, cost, tags, quantity }: IPublication) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "createPublication",
      args: [uri, title, summary, cost, tags, quantity],
    });
  };

  const useUpdatePublication = ({ id, uri, title, summary, cost, tags }: IPublication) => {
    const { writeContract } = useWriteContract();

    writeContract({
      chainId: targetNetwork.id,
      abi: deployedContractData?.abi ?? [],
      address: deployedContractData?.address ?? "0x0",
      functionName: "updatePublication",
      args: [id, uri, title, summary, cost, tags],
    });
  };

  return {
    targetNetwork,
    deployedContractData,
    useAddProfile,
    useAddComment,
    useFollow,
    useUnfollow,
    useUpVotePublication,
    useDownVotePublication,
    useCreatePublication,
    useUpdatePublication,
  };
}
