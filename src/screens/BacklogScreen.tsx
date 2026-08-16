import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { BacklogItem, getBacklog, addBacklogItem, removeBacklogItem } from '../services/storage';

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#00e57a' };
const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

export default function BacklogScreen() {
  const [items, setItems] = useState<BacklogItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => { load(); }, []);

  async function load() {
    setItems(await getBacklog());
  }

  async function handleAdd() {
    if (!title.trim()) return;
    await addBacklogItem({ title: title.trim(), notes: notes.trim(), priority });
    setTitle(''); setNotes(''); setPriority('medium');
    setShowModal(false);
    load();
  }

  async function handleDelete(id: string) {
    Alert.alert('Remove Topic', 'Remove this from your backlog?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        await removeBacklogItem(id);
        load();
      }},
    ]);
  }

  const byPriority = ['high', 'medium', 'low'] as const;
  const sorted = [...items].sort((a, b) =>
    byPriority.indexOf(a.priority) - byPriority.indexOf(b.priority)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Backlog</Text>
        <Text style={styles.headerSub}>{items.length} topic{items.length !== 1 ? 's' : ''} queued</Text>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Backlog is empty</Text>
            <Text style={styles.emptySub}>Add topics you want to learn — React hooks, SQL joins, whatever's next.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
            <View style={styles.itemBody}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
              <Text style={styles.itemMeta}>{PRIORITY_LABELS[item.priority]} · {formatDate(item.createdAt)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+ Add Topic</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add to Backlog</Text>

            <TextInput
              style={styles.input}
              placeholder="What do you want to learn?"
              placeholderTextColor="#6b7280"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Notes (optional)"
              placeholderTextColor="#6b7280"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <Text style={styles.priorityLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {(['high', 'medium', 'low'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityBtn, priority === p && { borderColor: PRIORITY_COLORS[p], backgroundColor: PRIORITY_COLORS[p] + '20' }]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityBtnText, priority === p && { color: PRIORITY_COLORS[p] }]}>
                    {PRIORITY_LABELS[p]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  header: { padding: 20, paddingTop: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#e8eaf6' },
  headerSub: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  list: { padding: 16, paddingBottom: 100 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#0d0d1a', borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#ffffff10', gap: 12,
  },
  priorityDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5, flexShrink: 0 },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '600', color: '#e8eaf6' },
  itemNotes: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  itemMeta: { fontSize: 11, color: '#4b5563', marginTop: 6, fontFamily: 'monospace' },
  deleteBtn: { padding: 4 },
  deleteText: { color: '#4b5563', fontSize: 16 },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#e8eaf6', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  fab: {
    position: 'absolute', bottom: 24, left: 20, right: 20,
    backgroundColor: '#00d4ff', borderRadius: 999, padding: 18, alignItems: 'center',
  },
  fabText: { color: '#08080f', fontWeight: '800', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' },
  modal: {
    backgroundColor: '#0d0d1a', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, borderTopWidth: 1, borderColor: '#ffffff15',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#e8eaf6', marginBottom: 20 },
  input: {
    backgroundColor: '#111124', borderRadius: 12, padding: 14, color: '#e8eaf6',
    fontSize: 15, borderWidth: 1, borderColor: '#ffffff12', marginBottom: 12,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  priorityLabel: { fontSize: 12, color: '#6b7280', marginBottom: 10, letterSpacing: 1 },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  priorityBtn: {
    flex: 1, padding: 10, borderRadius: 10, borderWidth: 1,
    borderColor: '#ffffff15', alignItems: 'center',
  },
  priorityBtnText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 999, borderWidth: 1, borderColor: '#ffffff15', alignItems: 'center' },
  cancelText: { color: '#9ca3af', fontWeight: '600' },
  addBtn: { flex: 2, padding: 16, borderRadius: 999, backgroundColor: '#00d4ff', alignItems: 'center' },
  addText: { color: '#08080f', fontWeight: '800', fontSize: 15 },
});
