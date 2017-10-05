import moment from 'moment'
import style from './style.scss'

export class Footer {
  constructor(){
    this.style = style
  }
  
  boaz = "<BoazBlake/>"
  year = moment().format('YYYY')
}
