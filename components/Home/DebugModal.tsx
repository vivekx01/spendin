// DebugModal.js
import React, { useState } from "react";
import { Modal, ScrollView, Text, Button, View } from "react-native";

export default function DebugModal({ data, visible, onClose }) {
    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
                <ScrollView>
                    <Text selectable style={{ fontFamily: "monospace" }}>
                        {JSON.stringify(data, null, 2)}
                    </Text>
                </ScrollView>
                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
}
