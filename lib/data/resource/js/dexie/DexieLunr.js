(function(){
	__import(js,sys.HardWorker);
	
	var LunrWorker = HardWorker.Extend(
		__import(raw,sys.lunrWorker.js),
		'setup',
		'save',
		'load',
		'search',
		'add',
		'remove',
		'update'
	);
	
	function Lunr(db){
		
		db.Version.prototype._parseStoresSpec = Dexie.override(db.Version.prototype._parseStoresSpec, function(origFunc) {
			return function (stores, dbSchema) {
                stores["_lunr"] = 'table';
				origFunc.call(this, stores, dbSchema);
			}
		});
		
		function saveLunr(table){
			table.lunr.save().then(function(data){
				db._lunr.put(
					{
						table: table.name,
						data: data,
					}
				);
			})
		}
		
		function restoreLunr(table){
			return db._lunr.get(table.name)
				.then(function(data){
					return table.createLunr(data);
				});
		}
		
		db.Version.prototype.lunr = function(stores){
			var tables = this._cfg.tables;
			Object.keys(stores).forEach(function(tableName){
				var table = tables[tableName];
				var primaryKey = table.schema.primKey.keyPath;
				var lunrConfig = stores[tableName];
				table.lunr = new LunrWorker();
				table.createLunr = function(data){
					if(data){
						return table.lunr.load(data.data);
					}
					else {
						return table.lunr.setup([primaryKey].concat(lunrConfig));
					}
				};
				
				var saveTimeout = null;
				
				function updateLunrTable(){
					if(saveTimeout){
						clearTimeout(saveTimeout);
					}
					saveTimeout = setTimeout(function(){
						saveTimeout = null;
						saveLunr(table)
					},200);
				}
				
				table.hook('creating',function(primaryKey,obj){
					this.onsuccess = function(){
						table.lunr.add(obj).then(updateLunrTable);
					}
				});
				
				table.hook('updating',function(modifications,primaryKey,obj){
					this.onsuccess = function(){
						var data = Dexie.deepClone(obj);
						Dexie.extend(data,modifications)
						table.lunr.update(data).then(updateLunrTable);
					};
				});
				
				table.hook('deleting',function(primKey,obj){
					this.onsuccess = function(){
						table.lunr.remove(obj).then(updateLunrTable);
					}
				});
				
				table.search = function(criteria){
					return table.lunr.search(criteria).then(function(ids){
						return table.where(table.schema.primKey.keyPath).anyOf(
							ids.map(function(item){
								return item.ref;
							})
						);
					});
				}
				
				db.on('ready',function(){
					return restoreLunr(table);
				});
			});
		}
	}
	
	Dexie.addons.push(Lunr);
})();