import { useEffect, useRef } from 'react'
import { analyticsApi } from '../api'

export function usePageTracking(path: string) {
	const tracked = useRef(false)

	useEffect(() => {
		if (tracked.current) return
		tracked.current = true

		analyticsApi.trackPageView(path, document.referrer).catch(() => {
			// Silently fail - analytics should not break the app
		})
	}, [path])
}
