class Constants {
    QUOTATION_STATUS = {
        DRAFT: 'Draft',
        SENT: 'Sent',
        ACCEPTED: 'Accepted',
        REJECTED: 'Rejected'
    }

    QUOTATION_STATUS_ARRAY = [
        { label: 'Draft', value: 'Draft', color: 'bg-slate-100 text-slate-600' },
        { label: 'Sent', value: 'Sent', color: 'bg-blue-50 text-blue-600' },
        { label: 'Accepted', value: 'Accepted', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Rejected', value: 'Rejected', color: 'bg-rose-50 text-rose-600' }
    ]

    QUOTATION_FILTER = {
        ALL: 'All',
        SENT: 'Sent',
        ACCEPTED: 'Accepted',
        REJECTED: 'Rejected',
        EXPIRED: 'Expired'
    }

    COST_TYPE = {
        CALCULATED: 'Calculated',
        FIXED: 'Fixed'
    }
}

export default new Constants();