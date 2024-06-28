const { useState, useEffect, useRef } = React;

import { utilService } from "../../../services/util.service.js"
import { MailSideBar } from "../cmps/MailSideBar.jsx";
import { MailHeader } from "../cmps/MailHeader.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { MailSorting } from "../cmps/MailSorting.jsx"
import { mailService } from "../services/mail.service.js"

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState({ status: 'inbox' })
    const [sortBy, setSortBy] = useState({ date: 1 })
    const [isAdding, setIsAdding] = useState(false)
    const [isOpenSideBar, setIsOpenSideBar] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)

    const debounceLoadBooks = useRef(utilService.debounce(loadMails, 300))


    useEffect(() => {
        debounceLoadBooks.current(filterBy, sortBy)
    }, [filterBy, sortBy])

    function loadMails(filterBy, sortBy) {
        mailService.query(filterBy, sortBy)
            .then(mails => {
                setMails(mails)
            })
    }

    function onSetFilterBy(filter) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filter }))
    }

    function onSetSortBy(sort) {
        setSortBy(sort)
    }

    function onOpenSideBar() {
        setIsOpenSideBar(prev => !prev)
    }

    if (!mails) return <div className="loader-container"> <div className="loader"></div></div>

    return (
        <section className="mail-index">
            <MailHeader
                mails={mails}
                setMails={setMails}
                setFilterBy={setFilterBy}
                onOpenSideBar={onOpenSideBar}
                setIsAdding={setIsAdding}
                isAdding={isAdding}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
                editId={editId}
            />
            <MailSorting
                mails={mails}
                onSetFilterBy={onSetFilterBy}
                onSetSortBy={onSetSortBy}
            />
            <MailSideBar
                mails={mails}
                isOpenSideBar={isOpenSideBar}
                onSetFilterBy={onSetFilterBy}
                setIsAdding={setIsAdding}
                isAdding={isAdding}
            />
            <MailList
                mails={mails}
                setMails={setMails}
                setIsEditing={setIsEditing}
                setEditId={setEditId}
            />
        </section>
    )
}

