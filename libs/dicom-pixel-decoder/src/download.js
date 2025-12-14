export function downloadUint8Array(data, filename) {
    if (!(data instanceof Uint8Array)) {
        throw new Error("data must be a Uint8Array");
    }

    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
