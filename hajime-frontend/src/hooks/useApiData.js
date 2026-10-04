import { useEffect, useState } from 'react'
import apiRequest from '../api/client'

// Loads data from the backend for a page.
//
//   const { data, loading, error, reload } = useApiData('/api/students')
//
// - data:    what the backend returned (null until it arrives)
// - loading: true while waiting
// - error:   a readable message if it failed, otherwise ''
// - reload:  call it to load again (for example after saving)
//
// Pass null as the path to skip loading (for example until a class is chosen).
function useApiData(path) {
    const [reloadCount, setReloadCount] = useState(0)

    // A label for this exact request, so old answers are never shown for a new request
    const requestKey = path ? `${path}#${reloadCount}` : null

    const [result, setResult] = useState({ key: null, data: null, error: '' })

    useEffect(() => {
        if (!path) return

        let cancelled = false

        apiRequest(path)
            .then((response) => {
                if (!cancelled) setResult({ key: requestKey, data: response.data, error: '' })
            })
            .catch((err) => {
                if (!cancelled) setResult({ key: requestKey, data: null, error: err.message })
            })

        // If the page closes or the path changes before the answer arrives, ignore the old answer
        return () => {
            cancelled = true
        }
    }, [path, requestKey])

    const isCurrent = result.key === requestKey

    return {
        data: isCurrent ? result.data : null,
        loading: Boolean(path) && !isCurrent,
        error: isCurrent ? result.error : '',
        reload: () => setReloadCount((count) => count + 1),
    }
}

export default useApiData
