import { createStore } from 'vuex'
import { ISubject } from '../type/subject'
import { computed } from 'vue'



const store = createStore({
    state: {
        subjectList: [{ id: -1, name: '' }],
        is_valid: false
    },
    getters: {
        isValid(state){
            return state.is_valid
        },
        getSubjectList(state) {
            console.log('store；', state.subjectList)
            return state.subjectList
        },
        getSubjectNameById: (state) => (id: number) => {
            const rslt = state.subjectList.find(obj => obj.id == id)
            if (rslt) {
                return rslt.name
            }
            return ""
        }
    },
    mutations: {
        setSubjectList(state, sublist: ISubject[]) {
            state.subjectList = [{ id: -1, name: "全部" }].concat(sublist)
            // console.log('sublist', state.subjectList)
            state.is_valid = true
        },
    }
})

export default store