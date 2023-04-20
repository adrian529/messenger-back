type ContactProps = {
    userId: string;
}

import xd from '../../../public/340987372_196446673142667_804629794630719344_n.jpg'

const Contact = (props: ContactProps) => {
    return (
        <div className="contact">
            <img className="contact-img" src="/src/340987372_196446673142667_804629794630719344_n.jpg"></img>
            <div className='xd'>
                <div className="contact-name">{props.userId}</div>
                <div className="contact-lastmsg">
                    <p>bly bly bly bly bly bly bly bly bly bly bly </p>
                    <time dateTime="20:00" className='contact-lastmsg_timestamp'>
                        12:52
                    </time>
                </div>
            </div>
        </div>
    )
}

export default Contact