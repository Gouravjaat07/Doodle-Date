import { useState } from "react";
import Modal, { modalInput, modalLabel, modalBtn } from "./Modal";

export default function Profile({ open, onClose, user, heroQ1, heroQ2, onSave }) {
  const [pName, setPName] = useState(user);
  const [pQ1,   setPQ1]   = useState(heroQ1);
  const [pQ2,   setPQ2]   = useState(heroQ2);

  // Re-sync local state when modal opens with fresh props
  const handleOpen = () => {
    setPName(user); setPQ1(heroQ1); setPQ2(heroQ2);
  };

  const save = () => {
    if (!pName.trim()) return;
    onSave({ name: pName.trim(), q1: pQ1, q2: pQ2 });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="👤 Your Profile">
      <label style={modalLabel}>Your Name</label>
      <input
        style={modalInput} value={pName}
        onChange={(e) => setPName(e.target.value)}
        placeholder="Your name..." maxLength={30}
      />

      {/* <label style={modalLabel}>Hero Quote Line 1</label>
      <input
        style={modalInput} value={pQ1}
        onChange={(e) => setPQ1(e.target.value)}
        placeholder="One Placement" maxLength={30}
      />

      <label style={modalLabel}>Hero Quote Line 2</label>
      <input
        style={modalInput} value={pQ2}
        onChange={(e) => setPQ2(e.target.value)}
        placeholder="can rewrite the story of generations" maxLength={60}
      /> */}

      <button
        className="mbtn-hover"
        style={modalBtn()}
        onClick={save}
      >Save Changes</button>

      <button style={modalBtn(false, true)} onClick={onClose}>Cancel</button>
    </Modal>
  );
}