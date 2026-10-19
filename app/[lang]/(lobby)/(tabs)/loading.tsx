/** โหลดเนื้อหาแท็บ — แสดงเฉพาะพื้นที่เนื้อหา (เปลือกด้านบนคงอยู่ ไม่กระพริบ) */
export default function TabsLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">กำลังโหลด...</span>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="motion-skeleton aspect-[4/3]" style={{ animationDelay: `${i * 80}ms` }} aria-hidden />
      ))}
    </div>
  );
}
