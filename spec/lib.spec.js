describe("lib test", function () {

    it("should load objects from file", function (done) {
        //leave fs not mcoked on purpose. Want to check if the file system actually work.
        var fs = require('fs');
        var lib = require('../lib/lib.js');
        var dir = process.cwd() + '/spec/testFiles';

        var objs = lib.loadFiles(dir);

        expect(objs.length).toBe(3);
        expect(objs[0].id).toBe("helloWorld");
        expect(objs[0].body).not.toBe(null);
        expect(objs[1].body).not.toBe(null);
        expect(objs[2].body).not.toBe(null);

        done();
    })

    it("should try to save store procs", function (done) {

        var proxyquire = require('proxyquire')
        var core = require('../lib/core.js');
        var lib = proxyquire('../lib/lib.js', { './core.js': core });
        var dir = 'testDir';
        var storeProcs = [{
            id: "helloWorld",
            serverScript: function () {
                var context = getContext();
                var response = context.getResponse();

            }
        },
            {
                id: "helloWorld2",
                serverScript: function () {
                    var context = getContext();
                    var response = context.getResponse();
                }
            }];

        spyOn(lib, "loadFiles").and.returnValue(storeProcs);

        spyOn(core, 'saveStoreProc');

        lib.createStoreProcs(dir, {});

        expect(lib.loadFiles).toHaveBeenCalledWith(dir);
        expect(core.saveStoreProc.calls.count()).toBe(storeProcs.length);

        done();
    })

    it("should try to save triggers", function (done) {

        var proxyquire = require('proxyquire')
        var core = require('../lib/core.js');
        var lib = proxyquire('../lib/lib.js', { './core.js': core });
        var dir = 'testDir';
        var triggers = [{
            id: "helloWorld",
            triggerType: "Pre",
            triggerOperation: "All",
            serverScript: function () {
                var context = getContext();
                var response = context.getResponse();

            }
        },
        {
            id: "helloWorld2",
            triggerType: "Post",
            triggerOperation: "Create",
            serverScript: function () {
                var context = getContext();
                var response = context.getResponse();
            }
        }];

        spyOn(lib, "loadFiles").and.returnValue(triggers);

        spyOn(core, 'saveTrigger');

        lib.createTriggers(dir, {});

        expect(lib.loadFiles).toHaveBeenCalledWith(dir);
        expect(core.saveTrigger.calls.count()).toBe(triggers.length);

        done();
    })

})