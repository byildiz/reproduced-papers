import toast from "react-hot-toast";

import { useFirebase, useAlgolia } from ".";

export default function usePaperActions() {
  const firebase = useFirebase();
  const algolia = useAlgolia();

  async function doStatusUpdate(id, status) {
    try {
      const data = { status };
      const doc = await firebase.updatePaper(id, data);
      await algolia.updatePaper(id, data);
      toast.success(`The paper was ${status}`);
      return await doc.get();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  async function doDelete(id) {
    try {
      await firebase.deletePaper(id);
      await algolia.deletePaper(id);
      toast.success("The paper was deleted");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  async function doMerge(id1, id2) {
    try {
      const oldReprods = firebase.getPaperReprods(id2);
      for (const reprod of oldReprods) {
        await algolia.updateReprod(reprod.id, { paperId: id1 });
      }
      await firebase.mergePapers(id1, id2);
      toast.success("The papers were merged");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  return { doStatusUpdate, doDelete, doMerge };
}
