import moment from 'moment'

export class FileListToArrayValueConverter {
  toView(fileList) {
    let files = [];
    if (!fileList) {
      return files;
    }
    for(let i = 0; i < fileList.length; i++) {
      files.push(fileList.item(i));
    }
    return files;
  }
}

export class BlobToUrlValueConverter {
  toView(blob) {
    return URL.createObjectURL(blob);
  }
}

export class LeaseDateFormatValueConverter {
  toView(value) {
    return moment(value).format('ll')
  }
}

export class TruncateTo50ValueConverter {
  toView(value) {
    console.log(value)
    // return value.slice(0,5)
  }
}