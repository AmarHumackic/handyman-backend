const DEFAULT_SIZE = 10;

module.exports = formatFileName = (fileNameWithExt) => {
  // extract file name and extension
  const fileName = fileNameWithExt.slice(0, fileNameWithExt.lastIndexOf('.'));
  const fileExtension = fileNameWithExt.slice(
    fileNameWithExt.lastIndexOf('.') + 1,
  );

  // prepare date and time
  const dt = new Date();
  const date = `${dt.getDate().toString().padStart(2, '0')}`;
  const month = `${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
  const year = `${dt.getFullYear().toString().padStart(4, '0')}`;
  const hours = `${dt.getHours().toString().padStart(2, '0')}`;
  const minutes = `${dt.getMinutes().toString().padStart(2, '0')}`;
  const seconds = `${dt.getSeconds().toString().padStart(2, '0')}`;

  //   31082021_094258;
  const dateTime = `${date}${month}${year}_${hours}${minutes}${seconds}`;

  // fileName_31082021_094258.png
  return `${fileName}_${dateTime}.${fileExtension}`;
};
