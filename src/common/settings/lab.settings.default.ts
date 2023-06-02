export const LabSettingsData = {
    require_results_for_mark_as_done: false,
    print_empty_result: false

}
export const ReportPrintSettingsData = {
    margin_top: 35,
    margin_right: 15,
    margin_bottom: 45,
    margin_left: 15,
    default_footer_type: 'none',
    default_header_type: 'none',
    default_download_header_type: 'none',
    default_download_footer_type: 'none'
}

export const FacilitySMSsettingsData = {
    reports_done_whatsapp: "Hi [pat-name]\n\nPlease collect your reports from lab.\n\nThanks.\n[lab-name]",
    reports_done_sms: "Hi [pat-name]\n\nPlease collect your reports from lab.\n\n[lab-name]",
    reports_done_and_payment_pending_whatsapp: "Hi [pat-name]\n\nPlease collect your reports from lab.\n\nThanks.\n[lab-name]",
    reports_done_and_payment_pending_sms: "Hi [pat-name]\n\nPlease collect your reports from lab.\n\n[lab-name]",
    registration_whatsapp: "Hi [pat-name]\n\nThanks for visiting [lab-name]. We will update you when your reports are completed.",
    registration_sms: "Hi [pat-name]\n\nThanks for visiting [lab-name]. We will update you when your reports are completed.",
    payment_done_sms: 'Hi [pat-name]\n\nYour payment is fully paid.\n\nThanks for visiting [lab-name].',
    payment_done_sms_status: true,
    payment_done_whatsapp: 'Hi [pat-name]\n\nYour payment is fully paid.\n\nThanks for visiting [lab-name].',
    registration_sms_status: true,
    reports_done_sms_status: true,
    reports_done_and_payment_pending_sms_status: true,
    registration_whatsapp_status: true,
    payment_done_whatsapp_status: true,
    reports_done_and_payment_pending_whatsapp_status: true,


}

export const AddonsSettingData = {
    whatsapp: { "status": false, "settings": { "registration": false, "payment_done": false, "reports_done": false } },
    sms: {
        "status": true,
        "settings": {
            "registration": false,
            "payment_done": false,
            "reports_done": true
        }
    }
}