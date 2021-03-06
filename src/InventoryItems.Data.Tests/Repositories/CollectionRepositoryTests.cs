using InventoryItems.Data.Infastructure;
using InventoryItems.Data.Repositories;
using InventoryItems.Data.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace InventoryItems.Data.Tests.Repositories
{
    [TestClass]
    public class CollectionRepositoryTests : TestBase {
        [TestMethod]
        public void CollectionRepository_Basic() {
            using (var context = DataCreation.CreateDb("CollectionRepository_Basic")) {
                //ARRANGE
                var repo = new CollectionRepository(new DatabaseFactory(context));
                repo.Mapper = CreateMapper();
                var collections = DataCreation.CreateCollections();
                context.AddRange(collections);
                context.SaveChanges();

                //ACT
                var collection = repo.GetById(collections[1].Id);

                //ASSERT
                Assert.AreEqual("Collection 2", collection.Name);
                Assert.AreEqual(collections[1].Id, collection.Id);
            }
        }

        [TestMethod]
        public void CollectionRepository_CollectionNotFound() {
            using (var context = DataCreation.CreateDb("CollectionRepository_CollectionNotFound")) {
                //ARRANGE
                var repo = new CollectionRepository(new DatabaseFactory(context));
                var collections = DataCreation.CreateCollections();
                context.AddRange(collections);
                context.SaveChanges();

                //ACT
                var collection = repo.GetById(Guid.NewGuid());

                //ASSERT
                Assert.IsNull(collection);
            }
        }
    }
}
