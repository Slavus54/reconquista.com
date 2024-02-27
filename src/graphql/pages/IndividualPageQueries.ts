import {gql} from '@apollo/client'

export const createIndividualM = gql`
    mutation createIndividual($username: String!, $id: String!, $fullname: String!, $category: String!, $sex: String!, $century: String!, $region: String!, $cords: ICord!, $achievement: String!) {
        createIndividual(username: $username, id: $id, fullname: $fullname, category: $category, sex: $sex, century: $century, region: $region, cords: $cords, achievement: $achievement)
    }
`

export const getIndividualsQ = gql`
    query {
        getIndividuals {
            shortid
            fullname
            category
            sex
            century 
            region
            cords {
                lat
                long
            }
            achievement
            quotes {
                shortid
                name
                text
                category
                rating
            }
            images {
                shortid
                name
                title
                format
                source
                likes
            }
        }
    }
`

export const getIndividualM = gql`
    mutation getIndividual($shortid: String!) {
        getIndividual(shortid: $shortid) {
            shortid
            fullname
            category
            sex
            century 
            region
            cords {
                lat
                long
            }
            achievement
            quotes {
                shortid
                name
                text
                category
                rating
            }
            images {
                shortid
                name
                title
                format
                source
                likes
            }
        }
    }
`

export const updateIndividualAchievementM = gql`
    mutation updateIndividualAchievement($username: String!, $id: String!, $achievement: String!) {
        updateIndividualAchievement(username: $username, id: $id, achievement: $achievement)
    }
`

export const manageIndividualQuoteM = gql`
    mutation manageIndividualQuote($username: String!, $id: String!, $option: String!, $text: String!, $category: String!, $rating: Float!, $coll_id: String!) {
        manageIndividualQuote(username: $username, id: $id, option: $option, text: $text, category: $category, rating: $rating, coll_id: $coll_id)
    }
`

export const manageIndividualImageM = gql`
    mutation manageIndividualImage($username: String!, $id: String!, $option: String!, $title: String!, $format: String!, $source: String!, $coll_id: String!) {
        manageIndividualImage(username: $username, id: $id, option: $option, title: $title, format: $format, source: $source, coll_id: $coll_id)
    }
`