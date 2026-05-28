import type { AccountSignal, Campaign } from "@/types";
import {
  addDoc,
  Timestamp,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";

import { db } from "./config";

interface SaveCampaignInput {
  targetCompetitor: string;
  painPoints?: string;
}

export async function saveCampaign({
  targetCompetitor,
  painPoints
}: SaveCampaignInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "campaigns"), {
      targetCompetitor,
      painPoints: painPoints?.trim() ? painPoints.trim() : "",
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error("Failed to save campaign:", error);
    throw error;
  }
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const campaignsQuery = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(campaignsQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data() as {
        targetCompetitor?: string;
        painPoints?: string;
        createdAt?: { toDate?: () => Date };
      };

      return {
        id: doc.id,
        targetCompetitor: data.targetCompetitor ?? "",
        painPoints: data.painPoints ?? "",
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date(0).toISOString()
      };
    });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
}

interface SaveAccountSignalInput extends Omit<AccountSignal, "id" | "timestamp"> {
  timestamp?: string;
}

export async function saveAccountSignal(signal: SaveAccountSignalInput): Promise<void> {
  try {
    await addDoc(collection(db, "account_signals"), {
      ...signal,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to save account signal:", error);
    throw error;
  }
}

export function subscribeToCampaignSignals(
  campaignId: string,
  callback: (signals: AccountSignal[]) => void
): () => void {
  const q = query(collection(db, "account_signals"), where("campaignId", "==", campaignId), orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const signals = snapshot.docs.map((doc) => {
        const data = doc.data() as Partial<AccountSignal> & { timestamp?: Timestamp };
        return {
          id: doc.id,
          campaignId: data.campaignId ?? "",
          accountId: data.accountId ?? "",
          companyName: data.companyName ?? "",
          intentSignal: data.intentSignal ?? "",
          sourceType: data.sourceType ?? "",
          confidenceScore: data.confidenceScore ?? 0,
          identifiedDecisionMakers: data.identifiedDecisionMakers ?? [],
          recommendedAction: data.recommendedAction ?? "",
          draftedEmail: data.draftedEmail ?? "",
          timestamp: data.timestamp?.toDate?.()?.toISOString() ?? new Date(0).toISOString()
        } as AccountSignal;
      });

      callback(signals);
    },
    (error) => {
      console.error("Failed to subscribe to campaign signals:", error);
    }
  );

  return unsubscribe;
}
