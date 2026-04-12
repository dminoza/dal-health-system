import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Barangay, RecordItem } from "../types";

export const getAllBarangaysWithRecords = async (): Promise<Barangay[]> => {
  // 1. Get all barangays
  const barangaySnap = await getDocs(collection(db, "barangays"));

  // 2. For each barangay, fetch its records
  const result = await Promise.all(
    barangaySnap.docs.map(async (docSnap) => {
      const barangayId = docSnap.id;

      const data = docSnap.data();

      const recordsSnap = await getDocs(
        collection(db, "barangays", barangayId, "records")
      );

      const records: RecordItem[] = recordsSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<RecordItem, "id">),
      }));

      return {
        id: barangayId,
        name: data.name,
        coordinates: data.coordinates,
        records,
      };
    })
  );

  return result;
};
