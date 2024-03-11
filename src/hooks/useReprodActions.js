import toast from "react-hot-toast";

import { useFirebase, useAlgolia } from ".";

export default function useReprodActions() {
  const firebase = useFirebase();
  const algolia = useAlgolia();

  async function doStatusUpdate(id, paperId, status) {
    try {
      const data = { status };
      const doc = await firebase.updateReprod(paperId, id, data);
      await algolia.updateReprod(id, data);
      toast.success(`The reproduction was ${status}`);
      return await doc.get();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  async function doDelete(id, paperId) {
    try {
      await firebase.deleteReprod(paperId, id);
      await algolia.deleteReprod(id);
      toast.success("The reproduction was deleted");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  return { doStatusUpdate, doDelete };
}
