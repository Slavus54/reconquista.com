import {gql} from '@apollo/client'

export const getProfilesQ = gql`
    query {
        getProfiles {
            account_id
            username
            password
            telegram
            goal
            budget
            region
            cords {
                lat
                long
            }
            main_photo
            treasures {
                shortid
                title
                category
                century
                image
                likes
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`

export const getProfileM = gql`
    mutation getProfile($account_id: String!) {
        getProfile(account_id: $account_id) {
            account_id
            username
            password
            telegram
            goal
            budget
            region
            cords {
                lat
                long
            }
            main_photo
            treasures {
                shortid
                title
                category
                century
                image
                likes
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`