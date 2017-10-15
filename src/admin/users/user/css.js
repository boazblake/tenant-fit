const Dto = {
  list: {
    borderWidth: 'border-width: 4px;'
  },

  card: {
    borderWidth: 'border-width: 2px;'
  }
}


const styleDto = component => attribute => { 
 //TODO:  console.log(Dto[component][attribute], component, attribute)
  return Dto[component][attribute]
}

const css = component => style => {
  return styleDto(component)(style)
}

export default css
