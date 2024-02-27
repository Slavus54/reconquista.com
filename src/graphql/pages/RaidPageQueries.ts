import {gql} from '@apollo/client'

export const createRaidM = gql`
    mutation createRaid($username: String!, $id: String!, $title: String!, $category: String!, $region: String!, $cords: ICord!, $dots: [ICord]!, $dateUp: String!, $time: String!, $role: String!) {
        createRaid(username: $username, id: $id, title: $title, category: $category, region: $region, cords: $cords, dots: $dots, dateUp: $dateUp, time: $time, role: $role)
    }
`

export const getRaidsQ = gql`
    query {
        getRaids {
            shortid
            username
            title
            category
            region
            cords {
                lat
                long
            }
            dots {
                lat
                long
            }
            dateUp
            time
            members {
                account_id
                username
                role
            }
            incidents {
                shortid
                name
                text
                format
                race
                image
                cords {
                    lat
                    long
                }
            }
            topics {
                shortid
                name
                title
                category
                url
                likes
            }
        }
    }
`

export const getRaidM = gql`
    mutation getRaid($shortid: String!) {
        getRaid(shortid: $shortid) {
            shortid
            username
            title
            category
            region
            cords {
                lat
                long
            }
            dots {
                lat
                long
            }
            dateUp
            time
            members {
                account_id
                username
                role
            }
            incidents {
                shortid
                name
                text
                format
                race
                image
                cords {
                    lat
                    long
                }
            }
            topics {
                shortid
                name
                title
                category
                url
                likes
            }
        }
    }
`

export const manageRaidStatusM = gql`
    mutation manageRaidStatus($username: String!, $id: String!, $option: String!, $role: String!) {
        manageRaidStatus(username: $username, id: $id, option: $option, role: $role)
    }
`

export const makeRaidIncidentM = gql`
    mutation makeRaidIncident($username: String!, $id: String!, $text: String!, $format: String!, $race: String!, $image: String!, $cords: ICord!) {
        makeRaidIncident(username: $username, id: $id, text: $text, format: $format, race: $race, image: $image, cords: $cords)
    }
`

export const manageRaidTopicM = gql`
    mutation manageRaidTopic($username: String!, $id: String!, $option: String!, $title: String!, $category: String!, $url: String!, $coll_id: String!) {
        manageRaidTopic(username: $username, id: $id, option: $option, title: $title, category: $category, url: $url, coll_id: $coll_id)
    }
`