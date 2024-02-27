import {gql} from '@apollo/client'

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($account_id: String!, $main_photo: String!) {
        updateProfilePersonalInfo(account_id: $account_id, main_photo: $main_photo) 
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($account_id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(account_id: $account_id, region: $region, cords: $cords) 
    }
`

export const updateProfileCommonInfoM = gql`
    mutation updateProfileCommonInfo($account_id: String!, $goal: String!, $budget: Float!) {
        updateProfileCommonInfo(account_id: $account_id, goal: $goal, budget: $budget)
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($account_id: String!, $password: String!) {
        updateProfilePassword(account_id: $account_id, password: $password)
    }
`


export const manageProfileTreasureM = gql`
    mutation manageProfileTreasure($account_id: String!, $option: String!, $title: String!, $category: String!, $century: String!, $image: String!, $coll_id: String!) {
        manageProfileTreasure(account_id: $account_id, option: $option, title: $title, category: $category, century: $century, image: $image, coll_id: $coll_id)
    }
`

export const createProfileM = gql`
    mutation createProfile($username: String!, $password: String!, $telegram: String!, $goal: String!, $budget: Float!, $region: String!, $cords: ICord!, $main_photo: String!) {
        createProfile(username: $username, password: $password, telegram: $telegram, goal: $goal, budget: $budget, region: $region, cords: $cords, main_photo: $main_photo) {
            account_id
            username
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($password: String!) {
        loginProfile(password: $password) {
            account_id
            username
        }
    }
`
