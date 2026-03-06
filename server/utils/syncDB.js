export const syncCollection = async (atlasModel, localModel) => {
  console.log("🔄 Starting Sync...");

  const atlasDocs = await atlasModel.find();
  const localDocs = await localModel.find();

  const localMap = new Map();
  localDocs.forEach((doc) => {
    localMap.set(doc._id.toString(), doc);
  });

  for (const atlasDoc of atlasDocs) {
    const localDoc = localMap.get(atlasDoc._id.toString());

    if (!localDoc) {
      // Insert missing
      await localModel.create(atlasDoc.toObject());
      console.log("➕ Added missing doc to Local");
    } else if (atlasDoc.updatedAt > localDoc.updatedAt) {
      // Update newer
      await localModel.findByIdAndUpdate(atlasDoc._id, atlasDoc.toObject());
      console.log("♻ Updated Local with newer Atlas version");
    }
  }

  console.log("✅ Sync Completed");
};