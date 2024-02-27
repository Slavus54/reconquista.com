import {gql} from '@apollo/client'

export const createLawM = gql`
    mutation createLaw($username: String!, $id: String!, $title: String!, $category: String!, $location: String!, $region: String!, $size: String!, $status: String!, $rating: Float!) {
        createLaw(username: $username, id: $id, title: $title, category: $category, location: $location, region: $region, size: $size, status: $status, rating: $rating) 
    }
`

export const getLawsQ = gql`
    query {
        getLaws {
            shortid
            username
            title
            category
            location
            region
            size
            status
            rating
            versions {
                shortid
                name
                text
                category
                likes
            }
            issues {
                shortid
                name
                title
                level
                image
                timestamp
            }
        }
    }
`

export const getLawM = gql`
    mutation getLaw($shortid: String!) {
        getLaw(shortid: $shortid) {
            shortid
            username
            title
            category
            location
            region
            size
            status
            rating
            versions {
                shortid
                name
                text
                category
                likes
            }
            issues {
                shortid
                name
                title
                level
                image
                timestamp
            }
        }
    }
`

export const manageLawVersionM = gql`
    mutation manageLawVersion($username: String!, $id: String!, $option: String!, $text: String!, $category: String!, $coll_id: String!) {
       manageLawVersion(username: $username, id: $id, option: $option, text: $text, category: $category, coll_id: $coll_id)
    }
`

export const updateLawInfoM = gql`
    mutation updateLawInfo($username: String!, $id: String!, $status: String!, $rating: Float!) {
        updateLawInfo(username: $username, id: $id, status: $status, rating: $rating)
    }
`

export const makeLawIssueM = gql`
    mutation makeLawIssue($username: String!, $id: String!, $title: String!, $level: String!, $image: String!, $timestamp: String!) {
        makeLawIssue(username: $username, id: $id, title: $title, level: $level, image: $image, timestamp: $timestamp)
    }
`