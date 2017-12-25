import moment from 'moment'

export class FileListToArrayValueConverter {
  toView(fileList) {
    let files = []
    if (!fileList) {
      return files
    }
    fileList.map(x => files.push(x))
    return files
  }
}

export class BlobToUrlValueConverter {
  toView(blob) {
    return URL.createObjectURL(blob)
  }
}

export class DateFormatValueConverter {
  toView(value) {
    return moment.utc(value).format('YYYY-MM-DD')
  }
}

export class TrimSearchValueConverter {
  toView(value) {
    value.split(' ').join()
  }
}
