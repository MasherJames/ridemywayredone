import azure from "azure-storage";
// Initialize storage account with the connection information
const blobService = azure.createBlobService(
  process.env.AZURE_STORAGE_ACCOUNT,
  process.env.AZURE_STORAGE_ACCESS_KEY
);

const handleBlobContainerOperation = (containerName) =>
  new Promise((resolve, reject) => {
    // create a container in which to store a blob, acts like a dir in the file system
    blobService.createContainerIfNotExists(
      containerName,
      {
        publicAccessLevel: "blob",
      },
      (error, result) => {
        if (!error) {
          resolve();
          if (result) {
            // New blob container successfully created
            return;
          } else {
            // blob container with the provided name already exists
            return;
          }
        } else {
          reject(error);
        }
      }
    );
  });

const handleFileUploadOperation = (
  createReadStream,
  containerName,
  filename,
  mimetype
) =>
  new Promise((resolve, reject) => {
    // pipe the read stream with file from apollo to a writable stream from azure and store the file
    createReadStream().pipe(
      blobService.createWriteStreamToBlockBlob(
        containerName,
        filename,
        {
          contentSettings: {
            contentType: mimetype,
          },
        },
        (error) => {
          if (error) {
            reject(error);
          } else {
            blobService.getBlobProperties(containerName, filename, (error) => {
              if (error) {
                reject(error);
              } else {
                const url = blobService.getUrl(containerName, filename);
                resolve(url);
              }
            });
          }
        }
      )
    );
  });

const uploadFile = async (
  containerName,
  filename,
  createReadStream,
  mimetype
) => {
  return Promise.all([
    handleBlobContainerOperation(containerName),
    handleFileUploadOperation(
      createReadStream,
      containerName,
      filename,
      mimetype
    ),
  ]);
};

export default uploadFile;
