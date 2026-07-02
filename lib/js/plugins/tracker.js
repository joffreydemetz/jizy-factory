const trackers = {};

export default class jTracker {
    constructor(trackers = null) {
        this.trackers = {};

        if (trackers) {
            this.setTrackers(trackers);
        }
    }

    setTrackers(trackers) {
        this.trackers = { ...this.trackers, ...trackers };
        return this;
    }

    /**
     * Add a tracker callback function.
     * @param {string} trackerName - The name of the tracker.
     * @param {function} callback - The callback function to be called for tracking.
     */
    add(trackerName, callback) {
        this.trackers[trackerName] = callback;
        return this;
    }

    track(eventName, eventData) {
        for (const trackerName in this.trackers) {
            if (this.trackers[trackerName](eventName, eventData)) {
                console.info('Tracked ' + trackerName + '.' + eventName, eventData || 'No Data');
            }
        }
    }
}
