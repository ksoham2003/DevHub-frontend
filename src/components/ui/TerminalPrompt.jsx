'use client';

/**
 * TerminalPrompt — renders a shell prompt line
 * Props: user (string), path (string), command (string)
 */
export default function TerminalPrompt({ user = 'root@devhub', path = '~', command }) {
  return (
    <div className="text-sm text-[#005a14] mb-3">
      <span className="text-[#00ff41]">{user}</span>
      <span className="text-[#005a14]">:{path}$ </span>
      {command && <span className="text-[#00cc33]">{command}</span>}
    </div>
  );
}
