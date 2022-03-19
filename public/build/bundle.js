
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/NameTag.svelte generated by Svelte v3.46.4 */

    const { window: window_1 } = globals;
    const file$4 = "src/components/NameTag.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t3;
    	let span2;
    	let t4;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text(/*out1*/ ctx[0]);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "(";
    			t3 = space();
    			span2 = element("span");
    			t4 = text(/*out2*/ ctx[1]);
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = ")";
    			t7 = space();
    			span4 = element("span");
    			t8 = text(/*out3*/ ctx[2]);
    			attr_dev(span0, "class", "name firstlast svelte-1uo6edw");
    			add_location(span0, file$4, 24, 4, 494);
    			attr_dev(span1, "class", "bracket svelte-1uo6edw");
    			add_location(span1, file$4, 25, 4, 541);
    			attr_dev(span2, "class", "name middle svelte-1uo6edw");
    			add_location(span2, file$4, 26, 4, 576);
    			attr_dev(span3, "class", "bracket svelte-1uo6edw");
    			add_location(span3, file$4, 27, 4, 620);
    			attr_dev(span4, "class", "name firstlast svelte-1uo6edw");
    			add_location(span4, file$4, 28, 4, 655);
    			attr_dev(div, "class", "name-container svelte-1uo6edw");
    			add_location(div, file$4, 23, 0, 461);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(div, t3);
    			append_dev(div, span2);
    			append_dev(span2, t4);
    			append_dev(div, t5);
    			append_dev(div, span3);
    			append_dev(div, t7);
    			append_dev(div, span4);
    			append_dev(span4, t8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "load", /*handleResize*/ ctx[3], false, false, false),
    					listen_dev(window_1, "resize", /*handleResize*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*out1*/ 1) set_data_dev(t0, /*out1*/ ctx[0]);
    			if (dirty & /*out2*/ 2) set_data_dev(t4, /*out2*/ ctx[1]);
    			if (dirty & /*out3*/ 4) set_data_dev(t8, /*out3*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NameTag', slots, []);
    	let { first } = $$props;
    	let { middle } = $$props;
    	let { last } = $$props;
    	let out1;
    	let out2;
    	let out3;

    	function handleResize() {
    		if (window.innerWidth > 875) {
    			$$invalidate(0, out1 = first);
    			$$invalidate(1, out2 = middle);
    			$$invalidate(2, out3 = last);
    		} else {
    			$$invalidate(0, out1 = first[0]);
    			$$invalidate(1, out2 = middle[0]);
    			$$invalidate(2, out3 = last[0]);
    		}
    	}

    	const writable_props = ['first', 'middle', 'last'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NameTag> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('first' in $$props) $$invalidate(4, first = $$props.first);
    		if ('middle' in $$props) $$invalidate(5, middle = $$props.middle);
    		if ('last' in $$props) $$invalidate(6, last = $$props.last);
    	};

    	$$self.$capture_state = () => ({
    		first,
    		middle,
    		last,
    		out1,
    		out2,
    		out3,
    		handleResize
    	});

    	$$self.$inject_state = $$props => {
    		if ('first' in $$props) $$invalidate(4, first = $$props.first);
    		if ('middle' in $$props) $$invalidate(5, middle = $$props.middle);
    		if ('last' in $$props) $$invalidate(6, last = $$props.last);
    		if ('out1' in $$props) $$invalidate(0, out1 = $$props.out1);
    		if ('out2' in $$props) $$invalidate(1, out2 = $$props.out2);
    		if ('out3' in $$props) $$invalidate(2, out3 = $$props.out3);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [out1, out2, out3, handleResize, first, middle, last];
    }

    class NameTag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { first: 4, middle: 5, last: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NameTag",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*first*/ ctx[4] === undefined && !('first' in props)) {
    			console.warn("<NameTag> was created without expected prop 'first'");
    		}

    		if (/*middle*/ ctx[5] === undefined && !('middle' in props)) {
    			console.warn("<NameTag> was created without expected prop 'middle'");
    		}

    		if (/*last*/ ctx[6] === undefined && !('last' in props)) {
    			console.warn("<NameTag> was created without expected prop 'last'");
    		}
    	}

    	get first() {
    		throw new Error("<NameTag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<NameTag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get middle() {
    		throw new Error("<NameTag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set middle(value) {
    		throw new Error("<NameTag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<NameTag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<NameTag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Background.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$3 = "src/components/Background.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "background svelte-18el57f");
    			set_style(div, "background-image", "url(\"/images/backgrounds/" + /*fileNum*/ ctx[0] + ".jpeg\")");
    			add_location(div, file$3, 18, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fileNum*/ 1) {
    				set_style(div, "background-image", "url(\"/images/backgrounds/" + /*fileNum*/ ctx[0] + ".jpeg\")");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Background', slots, []);
    	let { numImages } = $$props;
    	let fileNum;

    	function randomizeBackground() {
    		let curFileNum = fileNum;
    		$$invalidate(0, fileNum = Math.floor(Math.random() * numImages + 1));

    		if (numImages > 1 && curFileNum == fileNum) {
    			randomizeBackground();
    		}

    		console.log(fileNum);
    	}

    	randomizeBackground();
    	const writable_props = ['numImages'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Background> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('numImages' in $$props) $$invalidate(1, numImages = $$props.numImages);
    	};

    	$$self.$capture_state = () => ({ numImages, fileNum, randomizeBackground });

    	$$self.$inject_state = $$props => {
    		if ('numImages' in $$props) $$invalidate(1, numImages = $$props.numImages);
    		if ('fileNum' in $$props) $$invalidate(0, fileNum = $$props.fileNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fileNum, numImages, randomizeBackground];
    }

    class Background extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { numImages: 1, randomizeBackground: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Background",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*numImages*/ ctx[1] === undefined && !('numImages' in props)) {
    			console_1.warn("<Background> was created without expected prop 'numImages'");
    		}
    	}

    	get numImages() {
    		throw new Error("<Background>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numImages(value) {
    		throw new Error("<Background>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get randomizeBackground() {
    		return this.$$.ctx[2];
    	}

    	set randomizeBackground(value) {
    		throw new Error("<Background>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Link.svelte generated by Svelte v3.46.4 */

    const file$2 = "src/components/Link.svelte";

    function create_fragment$2(ctx) {
    	let span;
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t = text(/*text*/ ctx[1]);
    			attr_dev(a, "href", /*link*/ ctx[0]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-m8b0n8");
    			add_location(a, file$2, 6, 4, 87);
    			attr_dev(span, "class", "link svelte-m8b0n8");
    			add_location(span, file$2, 5, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);

    			if (dirty & /*link*/ 1) {
    				attr_dev(a, "href", /*link*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, []);
    	let { link } = $$props;
    	let { text } = $$props;
    	const writable_props = ['link', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ link, text });

    	$$self.$inject_state = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [link, text];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { link: 0, text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[0] === undefined && !('link' in props)) {
    			console.warn("<Link> was created without expected prop 'link'");
    		}

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Link> was created without expected prop 'text'");
    		}
    	}

    	get link() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/LinkContainer.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/components/LinkContainer.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let h2;
    	let t1;
    	let div0;
    	let link0;
    	let t2;
    	let link1;
    	let current;

    	link0 = new Link({
    			props: {
    				link: "https://github.com/kangzhiz",
    				text: "github"
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				link: "https://www.linkedin.com/in/kangzhiz",
    				text: "linkedin"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "LINKS:";
    			t1 = space();
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			create_component(link1.$$.fragment);
    			attr_dev(h2, "class", "header svelte-1pslayn");
    			add_location(h2, file$1, 5, 4, 91);
    			attr_dev(div0, "class", "links-group svelte-1pslayn");
    			add_location(div0, file$1, 7, 4, 127);
    			attr_dev(div1, "class", "links-container svelte-1pslayn");
    			add_location(div1, file$1, 4, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(link0, div0, null);
    			append_dev(div0, t2);
    			mount_component(link1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(link0);
    			destroy_component(link1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LinkContainer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LinkContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class LinkContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkContainer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let background;
    	let updating_randomizeBackground;
    	let t0;
    	let div;
    	let nametag;
    	let t1;
    	let linkcontainer;
    	let t2;
    	let img;
    	let img_src_value;
    	let current;
    	let mounted;
    	let dispose;

    	function background_randomizeBackground_binding(value) {
    		/*background_randomizeBackground_binding*/ ctx[1](value);
    	}

    	let background_props = { numImages: 3 };

    	if (/*randBg*/ ctx[0] !== void 0) {
    		background_props.randomizeBackground = /*randBg*/ ctx[0];
    	}

    	background = new Background({ props: background_props, $$inline: true });
    	binding_callbacks.push(() => bind(background, 'randomizeBackground', background_randomizeBackground_binding));

    	nametag = new NameTag({
    			props: {
    				first: "kangzhi",
    				middle: "john",
    				last: "zhao"
    			},
    			$$inline: true
    		});

    	linkcontainer = new LinkContainer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(background.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(nametag.$$.fragment);
    			t1 = space();
    			create_component(linkcontainer.$$.fragment);
    			t2 = space();
    			img = element("img");
    			attr_dev(div, "class", "text-body svelte-1ryvlq4");
    			add_location(div, file, 10, 4, 294);
    			if (!src_url_equal(img.src, img_src_value = "/images/kangaroo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Button");
    			attr_dev(img, "class", "svelte-1ryvlq4");
    			add_location(img, file, 14, 4, 419);
    			attr_dev(main, "class", "svelte-1ryvlq4");
    			add_location(main, file, 8, 0, 217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(background, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			mount_component(nametag, div, null);
    			append_dev(div, t1);
    			mount_component(linkcontainer, div, null);
    			append_dev(main, t2);
    			append_dev(main, img);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					img,
    					"click",
    					function () {
    						if (is_function(/*randBg*/ ctx[0])) /*randBg*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const background_changes = {};

    			if (!updating_randomizeBackground && dirty & /*randBg*/ 1) {
    				updating_randomizeBackground = true;
    				background_changes.randomizeBackground = /*randBg*/ ctx[0];
    				add_flush_callback(() => updating_randomizeBackground = false);
    			}

    			background.$set(background_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(background.$$.fragment, local);
    			transition_in(nametag.$$.fragment, local);
    			transition_in(linkcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(background.$$.fragment, local);
    			transition_out(nametag.$$.fragment, local);
    			transition_out(linkcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(background);
    			destroy_component(nametag);
    			destroy_component(linkcontainer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let randBg;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function background_randomizeBackground_binding(value) {
    		randBg = value;
    		$$invalidate(0, randBg);
    	}

    	$$self.$capture_state = () => ({
    		NameTag,
    		Background,
    		LinkContainer,
    		randBg
    	});

    	$$self.$inject_state = $$props => {
    		if ('randBg' in $$props) $$invalidate(0, randBg = $$props.randBg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [randBg, background_randomizeBackground_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
