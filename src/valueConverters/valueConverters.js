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

export class LeaseDateFormatValueConverter {
  toView(value) {
    return moment.utc(value).format('ll')
  }
}

export class TruncateTo50ValueConverter {
  toView(value) {
    console.log(value)
    // return value.slice(0,5)
  }
}

export class TrimSearchValueConverter {
  toView(value) {
    value.split(' ').join()
  }
}
