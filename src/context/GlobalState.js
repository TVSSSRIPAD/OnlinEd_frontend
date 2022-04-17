import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer'
import axios from 'axios'
//Initial State

const initialState = {
    classrooms: [],
    classroom : {},
    error: null,
    assignment:{},
    loading: true,
    name: '',
    email: '',
    isLoggedIn: true,
    verificationStatus: 'pending',
    verificationError: null,
    email: 'kd13@iitbbs.ac.in',
    isLoggedIn: true
}

//Create Context
export const GlobalContext = createContext(initialState);

//Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    //actions
    async function getClassrooms() {
        if (state.isLoggedIn) {
            const email = state.email;
            console.log("get classrooms",email)
            try {
              // dummy api
                dispatch({
                    type : 'CLASSROOMS_RQST'
                })
                const res = await axios.get(`/api/v1/classroom?email=${email}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("get classrooms",res.data);
                dispatch({
                    type: 'CLASSROOMS_RQST_SUCCESS',
                    payload: res.data
                });
            } catch (err) {
                dispatch({
                    type: 'GET_RQST_ERROR',
                    payload: err.response.data.error
                });
            }
        }
    }
    
    async function getAssignment(){
        const assignment_id = "625a9b289a6aa315c02e8791";
        if(state.isLoggedIn){
            dispatch({
                type : 'ASSIGNMENT_RQST',
            })
            try{
                const response = await axios.get(`/api/v1/assignment/${assignment_id}`)
                console.log('get assignment',response.data);
                dispatch({
                    type : 'ASSIGNMENT_RQST_SUCCESS',
                    payload : response.data
                })
            }catch(error){
                console.log('get assignment',error)
                dispatch({
                    type : 'GET_RQST_ERROR',
                    payload : error
                })
            }
        }
    }
    async function getAssignmentsOfClassroom(){
        const classroom_id = '625aff95d6e1aa155ca582c1';
        if(state.isLoggedIn){
            dispatch({
                type : 'ASSIGNMENTS_RQST'
            })
            try{
                const response = await axios.get(`/api/v1/classroom/${classroom_id}`)
                console.log('get assignments',response.data)
                dispatch({
                    type : 'ASSIGNMENTS_RQST_SUCCESS',
                    payload : response.data
                })
            }catch(error){
                console.log("get assignments",error)
                dispatch({
                    type : 'GET_RQST_ERROR'
                })
            }
        }
    }
    function userLogout() {
        dispatch({
            type: 'USER_LOGOUT'
        })
    }
    
    async function userLogin(data) {
        dispatch({
            type: 'USER_LOGIN',
            payload: data
        })
        const email = data.email;
        try {
            const res = await axios.get(`api/v1/classrooms/${email}`);

            dispatch({
                type: 'GET_CLASSROOMS',
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: 'ERROR',
                payload: err.response.data.error
            });
        }
    }

    async function verifyUser(userId) {
        console.log(' UserId sent for verification is ' + userId)
        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/verify/' + userId);

            dispatch({
                type: 'VERIFY_USER',
                payload: res.data.verificationStatus
            });
        } catch (err) {
            dispatch({
                type: 'VERIFICATION_ERROR',
                payload: err.response.data.error
            });
        }
        
    }
    
    return (<GlobalContext.Provider value={{
        classrooms: state.classrooms,
        classroom: state.classroom,
        error: state.error,
        loading: state.loading,
        name: state.name,
        assignment : state.assignment,
        email: state.email,
        isLoggedIn: state.isLoggedIn,
        verificationStatus: state.verificationStatus,
        getClassrooms,
        userLogin,
        getAssignment,
        userLogout,
        verifyUser,
        getAssignmentsOfClassroom
    }}>
        {children}
    </GlobalContext.Provider>)

}