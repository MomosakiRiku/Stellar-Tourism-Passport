import { useState, useCallback } from "react";
import { contractClient } from "../contracts/tourism-passport";

export interface LandmarkData {
  id: number;
  name: string;
  location: string;
  icon: string;
  image: string;
  description: string;
  stampTime?: number;
}

export interface CollectionData {
  id: number;
  name: string;
  description: string;
  icon: string;
  requiredLandmarks: number[];
  reward: string;
}

// Sample landmarks data
export const LANDMARKS: LandmarkData[] = [
  {
    id: 1,
    name: "Vịnh Hạ Long",
    location: "Quảng Ninh, Việt Nam",
    icon: "🏝️",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop",
    description: "Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi",
  },
  {
    id: 2,
    name: "Phố cổ Hội An",
    location: "Quảng Nam, Việt Nam",
    icon: "🏮",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop",
    description: "Phố cổ được UNESCO công nhận với đèn lồng lung linh",
  },
  {
    id: 3,
    name: "Cố đô Huế",
    location: "Thừa Thiên Huế, Việt Nam",
    icon: "🏯",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
    description: "Quần thể di tích cung đình triều Nguyễn",
  },
  {
    id: 4,
    name: "Phong Nha - Kẻ Bàng",
    location: "Quảng Bình, Việt Nam",
    icon: "🦇",
    image: "https://images.unsplash.com/photo-1564596823821-79b97151055e?w=400&h=300&fit=crop",
    description: "Hệ thống hang động lớn nhất thế giới",
  },
  {
    id: 5,
    name: "Sapa",
    location: "Lào Cai, Việt Nam",
    icon: "⛰️",
    image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?w=400&h=300&fit=crop",
    description: "Ruộng bậc thang tuyệt đẹp giữa núi rừng Tây Bắc",
  },
  {
    id: 6,
    name: "Đà Lạt",
    location: "Lâm Đồng, Việt Nam",
    icon: "🌸",
    image: "https://images.unsplash.com/photo-1586595620118-e820b3e3be32?w=400&h=300&fit=crop",
    description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm",
  },
];

// Sample collections
export const COLLECTIONS: CollectionData[] = [
  {
    id: 1,
    name: "Di sản miền Trung",
    description: "Thu thập dấu từ 3 di sản miền Trung Việt Nam",
    icon: "🏛️",
    requiredLandmarks: [2, 3, 4],
    reward: "NFT Di sản Miền Trung + 100 XLM",
  },
  {
    id: 2,
    name: "Khám phá Việt Nam",
    description: "Đi hết 6 địa danh nổi tiếng nhất Việt Nam",
    icon: "🇻🇳",
    requiredLandmarks: [1, 2, 3, 4, 5, 6],
    reward: "NFT Nhà thám hiểm Việt Nam + 500 XLM",
  },
  {
    id: 3,
    name: "Thiên nhiên hùng vĩ",
    description: "Khám phá 3 kỳ quan thiên nhiên",
    icon: "🌿",
    requiredLandmarks: [1, 4, 5],
    reward: "NFT Thiên nhiên + 200 XLM",
  },
];

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Set landmark admin
  const setLandmarkAdmin = useCallback(
    async (
      sourcePublicKey: string,
      adminAddress: string,
      landmarkId: number,
      managerAddress: string,
      signTransaction: any
    ) => {
      setLoading(true);
      clearMessages();
      try {
        await contractClient.setLandmarkAdmin(
          sourcePublicKey,
          adminAddress,
          landmarkId,
          managerAddress,
          signTransaction
        );
        setSuccess(`Đã phân quyền admin cho địa danh #${landmarkId}`);
        return true;
      } catch (err: any) {
        setError(err.message || "Lỗi khi phân quyền admin");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages]
  );

  // Issue stamp
  const issueStamp = useCallback(
    async (
      sourcePublicKey: string,
      managerAddress: string,
      travelerAddress: string,
      landmarkId: number,
      signTransaction: any
    ) => {
      setLoading(true);
      clearMessages();
      try {
        await contractClient.issueStamp(
          sourcePublicKey,
          managerAddress,
          travelerAddress,
          landmarkId,
          signTransaction
        );
        setSuccess(`Đã cấp dấu địa danh #${landmarkId} cho du khách`);
        return true;
      } catch (err: any) {
        setError(err.message || "Lỗi khi cấp dấu");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages]
  );

  // Verify collection
  const verifyCollection = useCallback(
    async (travelerAddress: string, landmarkIds: number[]) => {
      setLoading(true);
      clearMessages();
      try {
        const result = await contractClient.verifyCollection(
          travelerAddress,
          landmarkIds
        );
        return result;
      } catch (err: any) {
        setError(err.message || "Lỗi khi xác minh bộ sưu tập");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages]
  );

  // Claim reward
  const claimReward = useCallback(
    async (
      sourcePublicKey: string,
      travelerAddress: string,
      collectionId: number,
      requiredLandmarks: number[],
      signTransaction: any
    ) => {
      setLoading(true);
      clearMessages();
      try {
        await contractClient.claimReward(
          sourcePublicKey,
          travelerAddress,
          collectionId,
          requiredLandmarks,
          signTransaction
        );
        setSuccess(`Đã nhận thưởng cho bộ sưu tập #${collectionId}! 🎉`);
        return true;
      } catch (err: any) {
        setError(err.message || "Lỗi khi nhận thưởng");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearMessages]
  );

  // Get stamp time
  const getStampTime = useCallback(
    async (travelerAddress: string, landmarkId: number) => {
      try {
        return await contractClient.getStampTime(travelerAddress, landmarkId);
      } catch {
        return 0;
      }
    },
    []
  );

  // Check all stamps for a traveler
  const checkAllStamps = useCallback(
    async (travelerAddress: string) => {
      const stamps: Record<number, number> = {};
      for (const landmark of LANDMARKS) {
        const time = await getStampTime(travelerAddress, landmark.id);
        if (time > 0) {
          stamps[landmark.id] = time;
        }
      }
      return stamps;
    },
    [getStampTime]
  );

  return {
    loading,
    error,
    success,
    clearMessages,
    setLandmarkAdmin,
    issueStamp,
    verifyCollection,
    claimReward,
    getStampTime,
    checkAllStamps,
  };
}
