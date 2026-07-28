import { AnimatePresence as e, motion as t } from "motion/react";
import { createContext as n, useCallback as r, useContext as i, useEffect as a, useLayoutEffect as o, useMemo as s, useReducer as c, useRef as l } from "react";
import { RemoveScroll as u } from "react-remove-scroll";
import { createPortal as d } from "react-dom";
import { jsx as f, jsxs as p } from "react/jsx-runtime";
//#region src/DialogProvider.tsx
var m = { dialogs: {} }, h = {
	dialogs: {},
	show: () => {},
	close: () => {},
	updateProps: () => {},
	registerDialogId: () => {},
	unregisterDialogId: () => {}
}, g = n(h);
function _(e, { type: t, payload: n }) {
	switch (t) {
		case "ShowDialog": {
			let { dialogId: t, props: r } = n;
			return {
				...e,
				dialogs: {
					...e.dialogs,
					[t]: {
						...e.dialogs[t],
						isOpen: !0,
						props: r
					}
				}
			};
		}
		case "CloseDialog": {
			let { dialogId: t } = n;
			return {
				...e,
				dialogs: {
					...e.dialogs,
					[t]: {
						...e.dialogs[t],
						isOpen: !1
					}
				}
			};
		}
		case "UpdatePropsDialog": {
			let { dialogId: t, props: r } = n, i = {
				...e.dialogs[t].props,
				...r
			};
			return {
				...e,
				dialogs: {
					...e.dialogs,
					[t]: {
						...e.dialogs[t],
						props: i
					}
				}
			};
		}
	}
}
function v({ children: e, dialogs: t = null }) {
	let n = i(g), a = n !== h, [o, u] = c(_, m), d = l(/* @__PURE__ */ new Set()), v = r((e, t = {}) => {
		if (d.current.has(e) || !a) {
			u({
				type: "ShowDialog",
				payload: {
					dialogId: e,
					props: t
				}
			});
			return;
		}
		n.show(e, t);
	}, [a, n]), b = r((e) => {
		if (d.current.has(e) || !a) {
			u({
				type: "CloseDialog",
				payload: { dialogId: e }
			});
			return;
		}
		n.close(e);
	}, [a, n]), x = r((e, t) => {
		if (d.current.has(e) || !a) {
			u({
				type: "UpdatePropsDialog",
				payload: {
					dialogId: e,
					props: t
				}
			});
			return;
		}
		n.updateProps(e, t);
	}, [a, n]), S = r((e) => {
		d.current.add(e);
	}, []), C = r((e) => {
		d.current.delete(e);
	}, []), w = s(() => ({
		...n.dialogs,
		...o.dialogs
	}), [n.dialogs, o.dialogs]);
	return /* @__PURE__ */ p(g, {
		value: s(() => ({
			dialogs: w,
			show: v,
			close: b,
			updateProps: x,
			registerDialogId: S,
			unregisterDialogId: C
		}), [
			w,
			v,
			b,
			x,
			S,
			C
		]),
		children: [e, /* @__PURE__ */ f(y, { children: t })]
	});
}
var y = ({ children: e }) => {
	let t = document.body;
	return d(e, t);
};
//#endregion
//#region src/useClickAway.tsx
function b(e) {
	let t = l(null), n = l(e);
	return o(() => {
		n.current = e;
	}), a(() => {
		let e = (e) => {
			let r = t.current;
			r && !r.contains(e.target) && n.current(e);
		};
		return document.addEventListener("mousedown", e), document.addEventListener("touchstart", e), () => {
			document.removeEventListener("mousedown", e), document.removeEventListener("touchstart", e);
		};
	}, []), t;
}
//#endregion
//#region src/useDialog.ts
function x(e) {
	let { dialogs: t, show: n, close: a, updateProps: o } = i(g);
	return {
		show: r((t) => n(e, t || {}), [n, e]),
		close: r(() => a(e), [e, a]),
		updateProps: r((t) => o(e, t || {}), [e, o]),
		isOpen: t[e]?.isOpen ?? !1,
		props: t[e]?.props
	};
}
//#endregion
//#region src/Dialog.tsx
var S = {
	initial: {
		opacity: 0,
		scale: .75
	},
	animate: {
		opacity: 1,
		scale: 1
	},
	exit: {
		opacity: 0,
		scale: .75
	}
}, C = [];
function w({ id: n, children: o, animation: s = S, onClose: c }) {
	let { registerDialogId: l, unregisterDialogId: d } = i(g), { isOpen: p, close: m } = x(n);
	a(() => (l(n), () => {
		d(n);
	}), [
		n,
		l,
		d
	]), a(() => {
		function e() {
			let e = C.indexOf(n);
			e !== -1 && C.splice(e, 1);
		}
		return p ? C.push(n) : e(), () => {
			e();
		};
	}, [n, p]);
	let h = r(() => {
		c ? c() : m();
	}, [c, m]), _ = r(() => {
		setTimeout(() => {
			let e = C.length > 0 && C[C.length - 1] === n;
			p && e && h();
		}, 0);
	}, [
		n,
		p,
		h
	]), v = b(_);
	a(() => {
		if (!p) return;
		let e = (e) => {
			(e.key === "Esc" || e.key === "Escape") && (e.preventDefault(), _());
		};
		return window.addEventListener("keydown", e), () => {
			window.removeEventListener("keydown", e);
		};
	}, [p, _]);
	let y = s ?? {};
	return /* @__PURE__ */ f(e, { children: p && /* @__PURE__ */ f(t.dialog, {
		...y,
		className: "react-dialog",
		onCancel: (e) => e.preventDefault(),
		ref: (e) => {
			e && e.showModal();
		},
		children: /* @__PURE__ */ f(u, {
			className: "react-dialog-content",
			ref: v,
			children: o
		})
	}) });
}
//#endregion
export { w as Dialog, g as DialogContext, v as DialogProvider, x as useDialog };

//# sourceMappingURL=index.js.map