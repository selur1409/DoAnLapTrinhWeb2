module.exports = {
    // dt_start, dt_end valuetype of Date
    getTimeBetweenDate: function (dt_start, dt_end){
        var start = dt_start.getTime() / 1000;
        var end = dt_end.getTime() / 1000;
        var seconds = end - start;
        if (seconds <= 0){
            return {
                Notvalue: 1
            };
        }

        var minutes = Math.floor(seconds / 60);
        if (minutes === 0){
            return {
                days: 0, hours: 0, minutes: 0, seconds
            };
        }
        seconds = seconds - (minutes * 60);

        var hours = Math.floor(minutes / 60);
        if (hours === 0){
            return {
                days: 0, hours: 0, minutes, seconds
            };
        }
        minutes = minutes - (hours * 60);
        
        var days = Math.floor(hours / 24);
        hours = hours - (days * 24);
        return {
            days, hours, minutes, seconds
        };
    },
    getTime_Minutes: function (minutes){

        const seconds = 0;
        if (!minutes || minutes <= 0){
            return {
                days: 0, hours: 0, minutes: 0, seconds
            };
        }

        var hours = Math.floor(minutes / 60);
        if (hours === 0){
            return {
                days: 0, hours: 0, minutes, seconds
            };
        }
        minutes = minutes - (hours * 60);
        
        var days = Math.floor(hours / 24);
        hours = hours - (days * 24);
        return {
            days, hours, minutes, seconds
        };
    }
}