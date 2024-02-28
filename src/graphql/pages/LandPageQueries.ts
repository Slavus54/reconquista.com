import {gql} from '@apollo/client'

export const createLandM = gql`
    mutation createLand($username: String!, $id: String!, $title: String!, $category: String!, $century: String!, $region: String!, $cords: ICord!, $timestamp: String!, $period: String!) {
        createLand(username: $username, id: $id, title: $title, category: $category, century: $century, region: $region, cords: $cords, timestamp: $timestamp, period: $period)
    }
`

export const getLandsQ = gql`
    query {
        getLands {
            shortid
            username
            title
            category
            century
            region
            cords {
                lat
                long
            }
            timestamp
            period
            facts {
                shortid
                name
                text
                level
                format
                isTrue
            }
            locations {
                shortid
                name
                title
                category
                cords {
                    lat
                    long
                }
                image
                likes
            }
        }
    }
`

export const getLandM = gql`
    mutation getLand($shortid: String!) {
        getLand(shortid: $shortid) {
            shortid
            username
            title
            category
            century
            region
            cords {
                lat
                long
            }
            timestamp
            period
            facts {
                shortid
                name
                text
                level
                format
                isTrue
            }
            locations {
                shortid
                name
                title
                category
                cords {
                    lat
                    long
                }
                image
                likes
            }
        }
    }
`

export const makeLandFactM = gql`
    mutation makeLandFact($username: String!, $id: String!, $text: String!, $level: String!, $format: String!, $isTrue: Boolean!) {
        makeLandFact(username: $username, id: $id, text: $text, level: $level, format: $format, isTrue: $isTrue)
    }
`

export const updateLandInfoM = gql`
    mutation updateLandInfo($username: String!, $id: String!, $timestamp: String!, $period: String!) {
        updateLandInfo(username: $username, id: $id, timestamp: $timestamp, period: $period)
    }
`

export const manageLandLocationM = gql`
    mutation manageLandLocation($username: String!, $id: String!, $option: String!, $title: String!, $category: String!, $cords: ICord!, $image: String!, $coll_id: String!) {
        manageLandLocation(username: $username, id: $id, option: $option, title: $title, category: $category, cords: $cords, image: $image, coll_id: $coll_id)
    }
`