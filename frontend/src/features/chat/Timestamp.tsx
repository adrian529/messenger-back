import { parseISO, formatDistanceToNow, formatDistanceToNowStrict, format } from 'date-fns'

const Timestamp = ({ timeAgo, dateFormat }) => {


    const date = parseISO(timeAgo)
    const timePeriod = formatDistanceToNow(date)
    const formatted = format(date, 'dd/MM/yyyy HH:mm')
    const timestamp = `${timePeriod} ago`

    const time = dateFormat === 'formatted' ? formatted : timestamp

    return (
        <span title={timestamp} className="post-time-ago">
            {time}
        </span>
    )
}

export default Timestamp