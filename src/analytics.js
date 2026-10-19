// GoatCounter tracking. The script in index.html loads async, so a count
// made before it has loaded waits for it.
function count(vars) {
    const send = () => window.goatcounter.count(vars)
    if (window.goatcounter?.count) {
        send()
    } else {
        document.querySelector('script[data-goatcounter]')?.addEventListener('load', send, { once: true })
    }
}

export const trackPageview = path => count({ path })

export const trackEvent = name => count({ path: name, event: true })
