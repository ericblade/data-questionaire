class Questionaire {
    constructor(questions) {
        this.questions = questions;
        this.dataCollected = Object.keys(questions).reduce((a, key) => {
            a[key] = null;
            return a;
        }, {});
        this.sequence = [];
    }
    getResults() {
        return this.dataCollected;
    }
    getLast() {
        return this.sequence[this.sequence.length - 1];
    }
    // return the key for the current question, and the data content for the next, as it is likely
    // you will need to make some decisions knowing what the state of the next question is.
    getCurrent() {
        let current = null;
        Object.keys(this.questions).some((key) => {
            if (!this.dataCollected[key]) {
                current = { key, next: this.questions[key] };
                return true;
            }
            return false;
        });
        return current;
    }
    // TODO: devise a method by which a user can supply multiple answers at the same time,
    // and receive a response that is somehow appropriate for all of them.
    // ie, "I received x, y, and z as responses." not
    // "I received x.", "I received y.", "I received z."
    answer(key, answer) {
        this.sequence.push(key);
        this.dataCollected[key] = answer;

        let response = this.questions[key] && this.questions[key].response;
        if (typeof response === 'function') {
            const { message, transform } = response(answer, this.dataCollected);
            if (transform) {
                this.dataCollected[key] = transform;
            }
            if (message) {
                response = message;
            }
        }
        return {
            sequence: this.sequence,
            data: this.dataCollected,
            next: this.getCurrent(),
            response,
        };
    }
    ask(key) {
        const next = this.getCurrent();
        const m = key ? (this.questions[key] && this.questions[key].message) : (next && next.next.message);
        if (typeof m === 'function') {
            return m(this.dataCollected);
        } else {
            return m;
        }
    }
}

module.exports = Questionaire;

// let q = new Questionaire({
//     forDate: {
//         message: (data) => {
//             if (data.startTime) {
//                 return `What day would you like the meeting at ${data.startTime} scheduled for?`;
//             }
//             return `When would you like to schedule the meeting for?`;
//         }
//     },
//     startTime: {
//         message: (data) => {
//             if (data.forDate) {
//                 return `What time should the meeting on ${data.forDate} begin?`;
//             }
//             return `When would you like to schedule the meeting for?`;
//         }
//     },
//     duration: {
//         message: (data) => {
//             if (data.forDate && data.startTime) {
//                 return `How long will the meeting at ${data.forDate} ${data.startTime} run?`;
//             } else if(data.forDate) {
//                 return `How long will the meeting on ${data.forDate} run?`;
//             } else if(data.startTime) {
//                 return `How long will the meeting at ${data.startTime} run?`;
//             } else {
//                 return `How long will the meeting run?`;
//             }
//         }
//     },
//     subject: {
//         message: (data) => {
//             if (data.forDate && data.startTime) {
//                 return `What is the topic of the meeting at ${data.forDate} ${data.startTime}?`;
//             } else if(data.forDate) {
//                 return `What is the topic of the meeting on ${data.forDate}?`;
//             } else if(data.startTime) {
//                 return `What is the topic of the meeting at ${data.startTime}?`;
//             } else {
//                 return `What is the topic of the meeting?`;
//             }
//         }
//     },
//     location: {
//         message: (data) => {
//             if (data.forDate && data.startTime) {
//                 return `Where will the meeting on ${data.forDate} ${data.startTime} be held?`;
//             } else if(data.forDate) {
//                 return `Where will the meeting on ${data.forDate} be held?`;
//             } else if(data.startTime) {
//                 return `Where will the meeting at ${data.startTime} be held?`;
//             } else {
//                 return `Where will the meeting be held?`;
//             }
//         }
//     },
//     guest: {
//         message: (data) => {
//             if (data.forDate && data.startTime) {
//                 return `Who should be invited to the meeting on ${data.forDate} ${data.startTime}?`;
//             } else if(data.forDate) {
//                 return `Who should be invited to the meeting on ${data.forDate}?`;
//             } else if(data.startTime) {
//                 return `Who should be invited to the meeting at ${data.startTime}?`;
//             } else {
//                 return `Who should be invited to the meeting?`;
//             }
//         }
//     },
// });

// q.answer('guest', 'Test Guest');
// q.answer('location', 'Bellagio, Las Vegas');
// q.answer('forDate', '05-31-2017');
// console.warn(q.ask());

