import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { scheduleLocalNotification } from "../notification";
import { Alert } from "react-native";

const BACKGROUND_TASK_IDENTIFIER = "fetch-simple-task";
const MINIMUM_INTERVAL = 15;

let messageObj = {
    title: 'Hello',
    message: 'Background task triggered!'
}

export const initializeBackgroundTask = async()=>{
    Alert.alert("Bg task", "Initializing Background tasks")
    TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async()=>{
        await scheduleLocalNotification(messageObj.title, messageObj.message);
    });

    if (!(await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER))){
        Alert.alert("Task not found","Task was not registered, registered it.")
        await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
            minimumInterval: MINIMUM_INTERVAL
        })
    }
}

