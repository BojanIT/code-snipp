
import { suportedLanguages } from '../helpers/suported-languages.js'

export default (code) => {
    let text = ''
    suportedLanguages.forEach(el => {
        if (el.value === code)                    
            text = el.text            
        
    })

    return text
}